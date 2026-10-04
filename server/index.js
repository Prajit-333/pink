import express from 'express';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '5001', 10);

app.use(cors());
app.use(express.json());

// Temporary upload directory with auto-cleanup
const uploadDir = path.join(__dirname, 'temp_uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration with 10MB limits
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname || '.png')}`);
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
      error: 'Too many card messages sent from this IP. Please try again in a little while.',
    });
  }

  recentCalls.push(now);
  rateLimitMap.set(ip, recentCalls);
  next();
};

// Periodic cleanup of temp files older than 6 hours
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

// Serve temporary uploaded media for public CDN / webhook access
app.use('/temp_uploads', express.static(uploadDir));

// =================================================================
// 1. META WHATSAPP CLOUD API ADAPTER (Official Meta Graph API)
// =================================================================
async function uploadMediaToMeta(filePath, mimeType = 'image/png') {
  if (!process.env.META_WA_PHONE_NUMBER_ID || !process.env.META_WA_ACCESS_TOKEN) {
    return null;
  }

  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: mimeType });

  const formData = new globalThis.FormData();
  formData.append('messaging_product', 'whatsapp');
  formData.append('file', blob, path.basename(filePath));
  formData.append('type', mimeType);

  const res = await fetch(
    `https://graph.facebook.com/v20.0/${process.env.META_WA_PHONE_NUMBER_ID}/media`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.META_WA_ACCESS_TOKEN}`,
      },
      body: formData,
    }
  );

  const data = await res.json();
  if (!res.ok) {
    console.error('[Meta WA API] Media Upload Error:', data);
    throw new Error(data?.error?.message || 'Meta Media upload failed');
  }
  return data.id;
}

async function sendMetaWhatsAppAdapter({ toPhone, recipientName, senderName, messageText, cardFilePath, publicMediaUrl }) {
  if (!process.env.META_WA_PHONE_NUMBER_ID || !process.env.META_WA_ACCESS_TOKEN) {
    console.log(`[Meta WhatsApp] Mock Send to ${toPhone} (Configure META_WA_ACCESS_TOKEN & META_WA_PHONE_NUMBER_ID in .env):`, {
      recipientName,
      senderName,
      messageText,
      cardAttached: !!cardFilePath,
    });
    return { success: true, mocked: true, provider: 'meta-mock' };
  }

  const cleanPhone = toPhone.replace(/[^0-9]/g, '');
  const templateName = process.env.META_WA_TEMPLATE_NAME;

  let payload;

  if (templateName) {
    // A. Send via Approved WhatsApp Template (Required for initial outbound conversations)
    let mediaId = null;
    if (cardFilePath) {
      mediaId = await uploadMediaToMeta(cardFilePath);
    }

    const headerParams = [];
    if (mediaId) {
      headerParams.push({
        type: 'image',
        image: { id: mediaId },
      });
    } else if (publicMediaUrl) {
      headerParams.push({
        type: 'image',
        image: { link: publicMediaUrl },
      });
    }

    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en' },
        components: [
          ...(headerParams.length > 0 ? [{ type: 'header', parameters: headerParams }] : []),
          {
            type: 'body',
            parameters: [
              { type: 'text', text: recipientName || 'Friend' },
              { type: 'text', text: senderName || 'Someone who cares' },
              { type: 'text', text: messageText.substring(0, 1000) },
            ],
          },
        ],
      },
    };
  } else {
    // B. Send standard Media Image message with text caption
    let mediaId = null;
    if (cardFilePath) {
      mediaId = await uploadMediaToMeta(cardFilePath);
    }

    const caption = `🌸 *Breast Cancer Awareness Card*\n\nTo: ${recipientName}\nFrom: ${senderName}\n\n"${messageText}"\n\n🎀 *SGPGI Breast Health Program* - www.sgpgibreasthealth.org.in\nHelpline: 0522-2496200`;

    if (mediaId) {
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'image',
        image: {
          id: mediaId,
          caption: caption.substring(0, 1024),
        },
      };
    } else {
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'text',
        text: { body: caption },
      };
    }
  }

  const response = await fetch(
    `https://graph.facebook.com/v20.0/${process.env.META_WA_PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.META_WA_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();
  if (!response.ok) {
    console.error('[Meta WA API] Message Send Error:', result);
    throw new Error(result?.error?.message || 'Failed to dispatch WhatsApp message via Meta Cloud API');
  }

  return { success: true, provider: 'meta-cloud-api', messageId: result.messages?.[0]?.id };
}

// =================================================================
// 2. EMAIL ADAPTER (Nodemailer / SMTP)
// =================================================================
async function sendEmailAdapter({ to, subject, message, recipientName, senderName, cardFilePath }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log(`[Email] Mock Send to ${to} (Configure SMTP_HOST & SMTP_USER in .env):`, {
      subject,
      recipientName,
      senderName,
      cardAttached: !!cardFilePath,
    });
    return { success: true, mocked: true, provider: 'smtp-mock' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const attachments = [];
  if (cardFilePath && fs.existsSync(cardFilePath)) {
    attachments.push({
      filename: 'Breast-Cancer-Awareness-Card.png',
      path: cardFilePath,
      cid: 'greetingCardImage',
    });
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || `"Pink Hope Awareness" <${process.env.SMTP_USER}>`,
    to,
    subject: subject || `🌸 A Message of Strength & Hope for ${recipientName || 'You'}`,
    text: message,
    html: `
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
          attachments.length > 0
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
    `,
    attachments,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, provider: 'smtp-nodemailer', messageId: info.messageId };
}

// =================================================================
// 3. TWILIO ADAPTER (SMS & WhatsApp Fallback)
// =================================================================
async function sendTwilioAdapter({ channel, phoneNumber, message, mediaUrl }) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log(`[Twilio] Mock ${channel.toUpperCase()} to ${phoneNumber} (Configure TWILIO_* in .env):`, message);
    return { success: true, mocked: true, provider: 'twilio-mock' };
  }

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
  const fromNumber = channel === 'whatsapp' ? `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}` : process.env.TWILIO_SMS_FROM;
  const toNumber = channel === 'whatsapp' ? `whatsapp:${phoneNumber}` : phoneNumber;

  const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
  const params = new URLSearchParams();
  params.append('From', fromNumber);
  params.append('To', toNumber);
  params.append('Body', message);

  if (mediaUrl) {
    params.append('MediaUrl', mediaUrl);
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
  return { success: response.ok, sid: data.sid, provider: 'twilio' };
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
      const host = req.get('host');
      const protocol = req.protocol;
      publicMediaUrl = `${protocol}://${host}/temp_uploads/${filename}`;
    }

    let dispatchResult;

    if (channel === 'whatsapp') {
      if (!finalPhone) {
        return res.status(400).json({ error: 'Phone number is required for WhatsApp.' });
      }

      // 1. Prefer Meta WhatsApp Cloud API if configured
      if (process.env.META_WA_ACCESS_TOKEN && process.env.META_WA_PHONE_NUMBER_ID) {
        dispatchResult = await sendMetaWhatsAppAdapter({
          toPhone: finalPhone,
          recipientName: recipient,
          senderName: sender,
          messageText: finalMessage,
          cardFilePath,
          publicMediaUrl,
        });
      } else if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        // 2. Fallback to Twilio WhatsApp if configured
        dispatchResult = await sendTwilioAdapter({
          channel: 'whatsapp',
          phoneNumber: finalPhone,
          message: `🌸 *Breast Cancer Awareness Card*\nTo: ${recipient}\nFrom: ${sender} (${relationship})\n\n"${finalMessage}"\n\n🎀 SGPGI Breast Health Program`,
          mediaUrl: publicMediaUrl,
        });
      } else {
        // 3. Mock fallback for local testing & pre-deployment
        dispatchResult = await sendMetaWhatsAppAdapter({
          toPhone: finalPhone,
          recipientName: recipient,
          senderName: sender,
          messageText: finalMessage,
          cardFilePath,
          publicMediaUrl,
        });
      }
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

      dispatchResult = await sendTwilioAdapter({
        channel: 'sms',
        phoneNumber: finalPhone,
        message: `October Breast Cancer Awareness: ${finalMessage} - SGPGI Breast Health Helpline: 0522-2496200`,
        mediaUrl: null,
      });
    } else {
      return res.status(400).json({ error: `Unsupported channel: ${channel}` });
    }

    return res.status(200).json({
      success: true,
      channel,
      result: dispatchResult,
      message: 'Card message processed successfully.',
    });
  } catch (err) {
    console.error('[API Send Error]:', err);
    return res.status(500).json({
      error: err.message || 'Failed to dispatch card message via backend server.',
    });
  }
};

// Route definitions (accepts both single and field-based uploads)
const uploadMiddleware = upload.fields([
  { name: 'cardImage', maxCount: 1 },
  { name: 'voiceNote', maxCount: 1 },
]);

app.post('/api/send-message', rateLimiter, uploadMiddleware, handleSendRequest);
app.post('/api/send-card', rateLimiter, uploadMiddleware, handleSendRequest);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Pink Hope Breast Cancer Awareness Backend',
    metaWhatsAppConfigured: Boolean(process.env.META_WA_ACCESS_TOKEN && process.env.META_WA_PHONE_NUMBER_ID),
    smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
    twilioConfigured: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
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
    console.log(`   Meta WhatsApp API: ${process.env.META_WA_ACCESS_TOKEN ? '✅ Configured' : 'ℹ️  Mock Mode (Add keys to .env)'}`);
    console.log(`   SMTP Email: ${process.env.SMTP_HOST ? '✅ Configured' : 'ℹ️  Mock Mode (Add keys to .env)'}\n`);
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
