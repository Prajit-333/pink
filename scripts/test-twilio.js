import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const smsFrom = process.env.TWILIO_SMS_FROM;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || '+14155238886';

async function testTwilio() {
  console.log('🔍 Checking Twilio Credentials...');
  console.log('   Account SID:', accountSid ? `${accountSid.slice(0, 6)}...${accountSid.slice(-4)}` : '❌ Missing');
  console.log('   Auth Token :', authToken ? '✅ Configured' : '❌ Missing');
  console.log('   SMS From   :', smsFrom || 'Not set');
  console.log('   WhatsApp   :', whatsappFrom || 'Not set');

  if (!accountSid || !authToken) {
    console.error('\n❌ Please make sure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are in your .env file.');
    process.exit(1);
  }

  // Check which channel to test
  const testNumber = process.argv[2];
  if (!testNumber) {
    console.log('\n💡 Usage:');
    console.log('   node scripts/test-twilio.js <your_phone_number_with_country_code>');
    console.log('   Example: node scripts/test-twilio.js +919876543210\n');
    process.exit(0);
  }

  console.log(`\n🚀 Sending test message to: ${testNumber}`);

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  
  const params = new URLSearchParams();
  // If number starts with whatsapp or testing whatsapp
  const isWhatsApp = process.argv.includes('--whatsapp');
  if (isWhatsApp) {
    params.append('From', `whatsapp:${whatsappFrom}`);
    params.append('To', `whatsapp:${testNumber}`);
  } else {
    params.append('From', smsFrom);
    params.append('To', testNumber);
  }
  
  params.append(
    'Body',
    '🌸 Pink Hope Test: October is Breast Cancer Awareness Month! Early detection saves lives. (SGPGI Breast Health Program)'
  );

  try {
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
      console.log('\n✅ Message sent successfully via Twilio!');
      console.log('   Message SID:', data.sid);
      console.log('   Status     :', data.status);
      console.log('   To         :', data.to);
    } else {
      console.error('\n❌ Twilio API Error:', data.message || data);
      console.log('   Code:', data.code);
      if (data.code === 21608) {
        console.log('\n💡 Note: Trial Twilio accounts can only send SMS to numbers verified in Twilio Console (Phone Numbers -> Verified Caller IDs).');
      } else if (data.code === 63016) {
        console.log('\n💡 Note: For Twilio WhatsApp Sandbox, the recipient number must send the join code (e.g. "join <word>") to +14155238886 on WhatsApp first.');
      }
    }
  } catch (err) {
    console.error('\n❌ Network / Execution error:', err);
  }
}

testTwilio();
