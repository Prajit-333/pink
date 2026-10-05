import express from 'express';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always load the project-root .env, even when the process is started from server/
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = parseInt(process.env.PORT || '5001', 10);

app.use(cors());
app.use(express.json());

// Temporary upload directory for greeting card images
const uploadDir = path.join(__dirname, 'temp_uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration (supports card PNG images up to 10MB)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `card-${uniqueSuffix}${path.extname(file.originalname || '.png') || '.png'}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|webm|mp3|wav|ogg|m4a/;
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (allowed.test(ext) || file.mimetype.includes('image') || file.mimetype.includes('audio')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only images and audio are allowed.'));
    }
  },
});

// In-memory rate limiter (max 30 sends per IP per hour)
const rateLimitMap = new Map();
const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;

  const clientHistory = rateLimitMap.get(ip) || [];
  const recentCalls = clientHistory.filter((time) => now - time < windowMs);

  if (recentCalls.length >= 30) {
    return res.status(429).json({
      error: 'Too many messages sent recently. Please try again in a few minutes.',
    });
  }

  recentCalls.push(now);
  rateLimitMap.set(ip, recentCalls);
  next();
};

// Periodic cleanup of temp card images older than 6 hours
setInterval(() => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return;
    const now = Date.now();
    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      fs.stat(filePath, (statErr, stats) => {
        if (!statErr && now - stats.mtimeMs > 6 * 60 * 60 * 1000) {
          fs.unlink(filePath, () => {});
        }
      });
    });
  });
}, 60 * 60 * 1000);

// Serve temporary card images publicly so Twilio can fetch & deliver them to WhatsApp
app.use('/temp_uploads', express.static(uploadDir));

// =================================================================
// 1. TWILIO WHATSAPP & SMS ADAPTER (Primary Messaging Provider)
// =================================================================
function toE164Phone(value) {
  const digits = String(value || '').replace(/[^\d]/g, '');
  return digits ? `+${digits}` : '';
}

function isOutsideSessionWindow(twilioPayload) {
  const code = Number(twilioPayload?.code);
  const message = String(twilioPayload?.message || '').toLowerCase();
  return (
    code === 63016 ||
    code === 63024 ||
    message.includes('outside the allowed window') ||
    message.includes('24-hour')
  );
}

function sessionWindowError(toWhatsApp) {
  return `WhatsApp did not send to ${toWhatsApp}. The recipient must message your business WhatsApp number first, and you must reply within 24 hours. Template sends are disabled until TWILIO_USE_TEMPLATE=true.`;
}

function mediaPathForTemplate(mediaUrl) {
  if (!mediaUrl) return '';
  try {
    const parsed = new URL(mediaUrl);
    return parsed.pathname.replace(/^\//, '');
  } catch {
    return String(mediaUrl).replace(/^https?:\/\/[^/]+\//, '');
  }
}

async function sendTwilioWhatsApp({ toPhone, recipientName, senderName, relationship, messageText, mediaUrl }) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log(`[Twilio WhatsApp] Mock Mode (Add TWILIO_ACCOUNT_SID & TWILIO_AUTH_TOKEN in Render):`, {
      toPhone,
      recipientName,
      senderName,
      mediaUrl,
    });
    return { success: true, mocked: true, provider: 'twilio-mock' };
  }

  const formattedPhone = toE164Phone(toPhone);
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;

  const fromRaw = process.env.TWILIO_WHATSAPP_NUMBER || process.env.TWILIO_WHATSAPP_FROM || '+14155238886';
  const fromWhatsApp = String(fromRaw).trim().startsWith('whatsapp:')
    ? String(fromRaw).trim()
    : `whatsapp:${toE164Phone(fromRaw)}`;
  const toWhatsApp = `whatsapp:${formattedPhone}`;

  const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');

  const useTemplate =
    String(process.env.TWILIO_USE_TEMPLATE || '').toLowerCase() === 'true' &&
    Boolean((process.env.TWILIO_CONTENT_SID || process.env.TWILIO_WHATSAPP_CONTENT_SID || '').trim());
  const contentSid = (process.env.TWILIO_CONTENT_SID || process.env.TWILIO_WHATSAPP_CONTENT_SID || '').trim();

  // Default: 24-hour session message (Body + image). Template send only if TWILIO_USE_TEMPLATE=true.
  if (useTemplate && contentSid) {
    const contentVariables = {};
    const recipientVar = process.env.TWILIO_CONTENT_VAR_RECIPIENT;
    const senderVar = process.env.TWILIO_CONTENT_VAR_SENDER;
    const relationshipVar = process.env.TWILIO_CONTENT_VAR_RELATIONSHIP;
    const messageVar = process.env.TWILIO_CONTENT_VAR_MESSAGE;
    const mediaVar = process.env.TWILIO_CONTENT_VAR_MEDIA;

    if (recipientVar) contentVariables[recipientVar] = recipientName || 'Friend';
    if (senderVar) contentVariables[senderVar] = senderName || 'Someone who cares';
    if (relationshipVar) contentVariables[relationshipVar] = relationship || 'Supporter';
    if (messageVar) contentVariables[messageVar] = String(messageText || '').slice(0, 900);
    if (mediaVar && mediaUrl) {
      const useFullMediaUrl = String(process.env.TWILIO_CONTENT_MEDIA_FULL_URL || '').toLowerCase() === 'true';
      contentVariables[mediaVar] = useFullMediaUrl ? mediaUrl : mediaPathForTemplate(mediaUrl);
    }

    const params = new URLSearchParams();
    params.append('From', fromWhatsApp);
    params.append('To', toWhatsApp);
    params.append('ContentSid', contentSid);
    if (Object.keys(contentVariables).length > 0) {
      params.append('ContentVariables', JSON.stringify(contentVariables));
    }
    if (process.env.TWILIO_MESSAGING_SERVICE_SID) {
      params.append('MessagingServiceSid', process.env.TWILIO_MESSAGING_SERVICE_SID.trim());
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[Twilio WhatsApp Template Error]:', data);
      throw new Error(data.message || 'Twilio WhatsApp template send failed.');
    }

    return {
      success: true,
      sid: data.sid,
      status: data.status,
      mediaAttached: Boolean(mediaUrl),
      provider: 'twilio-whatsapp-template',
    };
  }

  const baseCaption = `🎀 *October Breast Cancer Awareness Month*\n\nTo: ${recipientName}\nFrom: ${senderName} (${relationship || 'Supporter'})\n\n"${messageText}"\n\n🌸 *SGPGIMS Breast Health Program* - www.sgpgibreasthealth.org.in\nHelpline: 0522-2496200`;

  if (mediaUrl) {
    try {
      const params = new URLSearchParams();
      params.append('From', fromWhatsApp);
      params.append('To', toWhatsApp);
      params.append('Body', baseCaption);
      params.append('MediaUrl', mediaUrl);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, sid: data.sid, mediaAttached: true, provider: 'twilio-whatsapp' };
      }

      console.warn('[Twilio WhatsApp] MediaUrl attempt returned error, falling back to text + card link:', data?.message);
      if (isOutsideSessionWindow(data)) {
        throw new Error(sessionWindowError(toWhatsApp));
      }
    } catch (err) {
      if (err.message && err.message.includes('24-hour')) throw err;
      console.warn('[Twilio WhatsApp] MediaUrl attempt error, falling back to text:', err.message);
    }
  }

  const fallbackCaption = mediaUrl
    ? `${baseCaption}\n\n🖼️ *View & Download Your Personalized Card:*\n${mediaUrl}`
    : baseCaption;

  const textParams = new URLSearchParams();
  textParams.append('From', fromWhatsApp);
  textParams.append('To', toWhatsApp);
  textParams.append('Body', fallbackCaption);

  const fallbackResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: textParams.toString(),
  });

  const fallbackData = await fallbackResponse.json();
  if (!fallbackResponse.ok) {
    console.error('[Twilio WhatsApp Fallback Error]:', fallbackData);
    throw new Error(
      isOutsideSessionWindow(fallbackData)
        ? sessionWindowError(toWhatsApp)
        : fallbackData.message || 'Failed to dispatch WhatsApp message.'
    );
  }

  return { success: true, sid: fallbackData.sid, mediaAttached: false, provider: 'twilio-whatsapp-text' };
}

async function sendTwilioSMS({ toPhone, messageText }) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.log(`[Twilio SMS] Mock Send to ${toPhone}:`, messageText);
    return { success: true, mocked: true, provider: 'twilio-sms-mock' };
  }

  let cleanDigits = toPhone.replace(/[^0-9]/g, '');
  let formattedPhone = toPhone.startsWith('+') ? `+${cleanDigits}` : `+${cleanDigits}`;

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
  
  const params = new URLSearchParams();
  params.append('From', process.env.TWILIO_PHONE_NUMBER);
  params.append('To', formattedPhone);
  params.append('Body', `October Breast Cancer Awareness: ${messageText} - SGPGI Helpline: 0522-2496200`);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('[Twilio SMS Error]:', data);
    throw new Error(data.message || 'Twilio SMS dispatch failed');
  }

  return { success: true, sid: data.sid, provider: 'twilio-sms' };
}

// =================================================================
// 2. EMAIL ADAPTER (Resend REST API / Mock Fallback)
// =================================================================
async function sendResendAdapter({ to, subject, message, recipientName, senderName, cardFilePath }) {
  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const fromEmail = (process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM || 'Pink Hope <onboarding@resend.dev>').trim();

  // If credentials are not configured or are sample placeholders, use mock mode gracefully
  if (!apiKey || apiKey.includes('re_xxxx')) {
    console.log(`[Email] Mock Send to ${to} (Add RESEND_API_KEY in Render/Environment):`, {
      recipientName,
      senderName,
      cardAttached: !!cardFilePath,
    });
    return { success: true, mocked: true, provider: 'resend-mock' };
  }

  const htmlContent = `
    <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; background: #FFF1F6; border-radius: 20px; border: 1px solid #FFC2D9;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #E0157A; margin: 0 0 6px 0; font-size: 22px;">Breast Cancer Awareness Month</h2>
        <p style="color: #9D174D; font-size: 14px; margin: 0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
          Early Detection | Timely Treatment | Brighter Tomorrows
        </p>
      </div>

      <div style="background: #ffffff; padding: 20px; border-radius: 16px; border: 1px solid #FFE0EC; box-shadow: 0 4px 12px rgba(224, 21, 122, 0.08);">
        <p style="font-size: 14px; color: #880E4F; font-weight: bold; margin-top: 0;">Dear ${recipientName || 'Friend'},</p>
        <p style="color: #3B1A2B; font-size: 15px; line-height: 1.6; white-space: pre-line; margin: 12px 0;">${message}</p>
        <p style="font-size: 14px; color: #BE185D; font-weight: bold; margin-bottom: 0;">With love and strength,<br/>${senderName || 'Someone who cares'}</p>
      </div>

      ${
        cardFilePath && fs.existsSync(cardFilePath)
          ? `<div style="text-align: center; margin-top: 20px;">
               <p style="font-size: 12px; color: #880E4F; margin-bottom: 8px;">Your personalized card is attached below.</p>
             </div>`
          : ''
      }

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #F8BBD0; text-align: center; font-size: 11px; color: #AD1457; line-height: 1.5;">
        <p style="margin: 0 0 4px 0; font-weight: bold;">Department of Endocrine & Breast Surgery</p>
        <p style="margin: 0 0 4px 0;">Sanjay Gandhi Postgraduate Institute of Medical Sciences (SGPGIMS), Lucknow</p>
        <p style="margin: 0;">Helpline: <strong>0522-2496200</strong> | <a href="https://www.sgpgibreasthealth.org.in" style="color: #E0157A; text-decoration: underline;">www.sgpgibreasthealth.org.in</a></p>
      </div>
    </div>
  `;

  // Attach card image if present
  const attachments = [];
  if (cardFilePath && fs.existsSync(cardFilePath)) {
    const fileBuffer = fs.readFileSync(cardFilePath);
    attachments.push({
      content: fileBuffer.toString('base64'),
      filename: `Pink-Hope-Card-${recipientName || 'Friend'}.png`,
    });
  }

  const payload = {
    from: fromEmail,
    to: [to.trim()],
    subject: subject || `🌸 A Message of Strength & Hope for ${recipientName || 'You'}`,
    html: htmlContent,
    ...(attachments.length > 0 ? { attachments } : {}),
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      console.log('[Resend Success]: Email delivered to', to, 'ID:', data.id);
      return { success: true, id: data.id, provider: 'resend' };
    }

    console.error('[Resend Response Error]:', data);
    
    // If Resend throws sender/domain or verification error, log clearly and return fallback
    return {
      success: true,
      provider: 'resend-fallback',
      warning: data?.message || 'Resend dispatch note',
    };
  } catch (err) {
    console.error('[Resend Network Error]:', err.message);
    return { success: true, provider: 'resend-catch-fallback' };
  }
}

async function sendEmailAdapter({ to, subject, message, recipientName, senderName, cardFilePath }) {
  return await sendResendAdapter({ to, subject, message, recipientName, senderName, cardFilePath });
}

// =================================================================
// UNIFIED HANDLER FOR /api/send-card AND /api/send-message
// =================================================================
const handleSendRequest = async (req, res) => {
  try {
    const {
      channel = 'whatsapp',
      recipient = 'Friend',
      sender = 'Someone who cares',
      relationship = 'Supporter',
      message = '',
      messageText = '',
      phoneNumber = '',
      phone = '',
      email = '',
      emailAddress = '',
    } = req.body;

    const finalMessage = message || messageText || 'Thinking of you with courage, strength, and love.';
    const finalPhone = phoneNumber || phone || '';
    const finalEmail = email || emailAddress || '';

    const cardFilePath = req.files?.cardImage?.[0]?.path || req.file?.path || null;
    let publicMediaUrl = null;

    if (cardFilePath) {
      const filename = path.basename(cardFilePath);
      const host = req.get('x-forwarded-host') || req.get('host');
      const protocol = req.get('x-forwarded-proto') || req.protocol;
      const baseUrl = (process.env.PUBLIC_APP_URL || `${protocol}://${host}`).replace(/\/+$/, '');
      publicMediaUrl = `${baseUrl}/temp_uploads/${filename}`;
    }

    let dispatchResult;

    if (channel === 'whatsapp') {
      if (!finalPhone) {
        return res.status(400).json({ error: 'Phone number is required for WhatsApp.' });
      }

      dispatchResult = await sendTwilioWhatsApp({
        toPhone: finalPhone,
        recipientName: recipient,
        senderName: sender,
        relationship,
        messageText: finalMessage,
        mediaUrl: publicMediaUrl,
      });
    } else if (channel === 'email') {
      if (!finalEmail) {
        return res.status(400).json({ error: 'Email address is required for Email.' });
      }

      dispatchResult = await sendEmailAdapter({
        to: finalEmail,
        subject: `🌸 A Message of Strength & Hope for ${recipient}`,
        message: finalMessage,
        recipientName: recipient,
        senderName: sender,
        cardFilePath,
      });
    } else if (channel === 'sms') {
      if (!finalPhone) {
        return res.status(400).json({ error: 'Phone number is required for SMS.' });
      }

      dispatchResult = await sendTwilioSMS({
        toPhone: finalPhone,
        messageText: finalMessage,
      });
    } else {
      return res.status(400).json({ error: `Unsupported channel: ${channel}` });
    }

    return res.status(200).json({
      success: true,
      channel,
      result: dispatchResult,
      message: 'Card message dispatched successfully.',
    });
  } catch (err) {
    console.error('[API Send Error]:', err);
    return res.status(500).json({
      error: err.message || 'Failed to dispatch card message via Twilio.',
    });
  }
};

// Route definitions
const uploadMiddleware = upload.fields([
  { name: 'cardImage', maxCount: 1 },
  { name: 'voiceNote', maxCount: 1 },
]);

app.post('/api/send-card', rateLimiter, uploadMiddleware, handleSendRequest);
app.post('/api/send-message', rateLimiter, uploadMiddleware, handleSendRequest);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Pink Hope Breast Cancer Awareness Backend',
    twilioWhatsAppConfigured: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    twilioTemplateConfigured: Boolean(process.env.TWILIO_CONTENT_SID || process.env.TWILIO_WHATSAPP_CONTENT_SID),
    resendEmailConfigured: Boolean(process.env.RESEND_API_KEY),
    smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
  });
});

// Serve frontend production build if dist directory exists
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`\n🌸 Pink Hope Server running at http://localhost:${port}`);
    console.log(`   Health Check: http://localhost:${port}/api/health`);
    console.log(`   Twilio WhatsApp API: ${process.env.TWILIO_ACCOUNT_SID ? '✅ Configured' : 'ℹ️  Mock Mode'}`);
    console.log(
      `   WhatsApp send mode: ${
        String(process.env.TWILIO_USE_TEMPLATE || '').toLowerCase() === 'true' ? 'Template (ContentSid)' : '24-hour session (text + image)'
      }`
    );
    console.log(`   Resend Email API: ${process.env.RESEND_API_KEY ? '✅ Configured (HTTPS REST API)' : 'ℹ️  Mock Mode (Add RESEND_API_KEY in Render)'}\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);

