import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import { sendEmergencyEmail, isWeb3FormsConfigured, submitToWeb3Forms } from './services/web3formsService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rate Limiting to prevent SOS spamming / duplicate accidental triggers
const sosLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many emergency requests from this IP. Please wait before triggering SOS again.',
    error: 'Rate limit exceeded',
  },
});

// =============================================================================
// 1. MSG91 SMS Provider Configuration
// =============================================================================
const msg91AuthKey = (process.env.MSG91_AUTH_KEY || '').trim();
const msg91TemplateId = (process.env.MSG91_TEMPLATE_ID || '').trim();
const msg91SenderId = (process.env.MSG91_SENDER_ID || '').trim();

const isMsg91Configured = Boolean(
  msg91AuthKey &&
  !msg91AuthKey.includes('your_msg91') &&
  msg91AuthKey !== 'TEST'
);

// =============================================================================
// 2. Twilio Configuration (Preserved for Automatic Outbound Voice Calls ONLY)
// =============================================================================
const accountSid = (process.env.TWILIO_ACCOUNT_SID || '').trim();
const authToken = (process.env.TWILIO_AUTH_TOKEN || '').trim();
let twilioPhoneNumber = (process.env.TWILIO_PHONE_NUMBER || '').trim();

if (twilioPhoneNumber && !twilioPhoneNumber.startsWith('+')) {
  if (twilioPhoneNumber.length === 10) {
    twilioPhoneNumber = `+91${twilioPhoneNumber}`;
  } else {
    twilioPhoneNumber = `+${twilioPhoneNumber}`;
  }
}

const isTwilioVoiceConfigured = Boolean(
  accountSid &&
  authToken &&
  twilioPhoneNumber &&
  accountSid.startsWith('AC') &&
  !accountSid.includes('your_twilio')
);

let twilioClient = null;

// =============================================================================
// 3. Emergency Email Alert Provider (SMTP / Nodemailer)
// =============================================================================
const smtpHost = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = (process.env.SMTP_USER || '').trim();
const smtpPass = (process.env.SMTP_PASS || '').trim();
const emailFrom = (process.env.EMAIL_FROM || (smtpUser ? `"SafeHer Emergency Alert" <${smtpUser}>` : '"SafeHer Emergency Alert" <emergency@safeher.app>')).trim();

const isEmailConfigured = Boolean(
  smtpUser && 
  smtpPass && 
  !smtpUser.includes('your_') && 
  !smtpPass.includes('your_')
);

let emailTransporter = null;
if (isEmailConfigured) {
  try {
    emailTransporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
    console.log(`✅ [EMAIL CONFIG] Emergency Email Transporter Initialized (${smtpHost}:${smtpPort}) - From: ${emailFrom}`);
  } catch (err) {
    console.error('❌ [EMAIL CONFIG] Failed to initialize Email Transporter:', err.message);
  }
} else {
  console.log('ℹ️ [EMAIL CONFIG] SMTP credentials unconfigured in .env. Emergency alert emails will be logged/marked unconfigured.');
}

// =============================================================================
// 4. Web3Forms Emergency Email Provider Configuration
// =============================================================================
const web3FormsAccessKey = (process.env.WEB3FORMS_ACCESS_KEY || '').trim();
const hasWeb3Forms = isWeb3FormsConfigured();

console.log('\n=============================================================================');
console.log('🛡️ SAFEHER EMERGENCY TELEPHONY & NOTIFICATION BACKEND SERVER');
console.log('=============================================================================');

if (hasWeb3Forms) {
  const maskedW3Key = web3FormsAccessKey.length > 8
    ? `${web3FormsAccessKey.substring(0, 4)}...${web3FormsAccessKey.slice(-4)}`
    : '***';
  console.log(`✅ [WEB3FORMS CONFIG] Web3Forms Email Service Initialized Successfully`);
  console.log(`   Access Key: ${maskedW3Key}`);
  console.log(`   API Endpoint: https://api.web3forms.com/submit`);
} else {
  console.log('ℹ️ [WEB3FORMS CONFIG] WEB3FORMS_ACCESS_KEY unconfigured in .env.');
}


if (isMsg91Configured) {
  console.log(`✅ [MSG91 CONFIG] MSG91 SMS Provider Initialized Successfully`);
  console.log(`   Auth Key: ${msg91AuthKey.substring(0, 4)}...${msg91AuthKey.slice(-4)}`);
  console.log(`   Template ID: ${msg91TemplateId || 'Not set (Using direct SMS fallback)'}`);
  console.log(`   Sender ID: ${msg91SenderId || 'SFHERO (Default)'}`);
} else {
  console.log('❌ [MSG91 CONFIG] MSG91 SMS configuration is missing or unconfigured in .env.');
  console.log('   Add MSG91_AUTH_KEY, MSG91_TEMPLATE_ID, and MSG91_SENDER_ID to .env for real SMS delivery.');
}

if (isTwilioVoiceConfigured) {
  try {
    twilioClient = twilio(accountSid, authToken);
    console.log(`✅ [TWILIO VOICE CONFIG] Twilio Voice Calling Initialized Successfully`);
    console.log(`   Account SID: ${accountSid.substring(0, 6)}...${accountSid.slice(-4)}`);
    console.log(`   From Phone Number: ${twilioPhoneNumber}`);
  } catch (err) {
    console.error('❌ [TWILIO VOICE CONFIG] Twilio client error:', err.message);
  }
} else {
  console.log('ℹ️ [TWILIO VOICE CONFIG] Twilio Voice unconfigured. Outbound phone calls disabled.');
}
console.log('=============================================================================\n');

// Phone Number Formatting Helpers
function formatPhoneForMSG91(phoneStr) {
  if (!phoneStr) return { isValid: false, msg91Number: '', masked: '' };

  let cleaned = phoneStr.replace(/[^\d]/g, '');

  let msg91Number = '';
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    msg91Number = `91${cleaned}`;
  } else if (/^0[6-9]\d{9}$/.test(cleaned)) {
    msg91Number = `91${cleaned.substring(1)}`;
  } else if (/^91[6-9]\d{9}$/.test(cleaned)) {
    msg91Number = cleaned;
  } else if (cleaned.length >= 10 && cleaned.length <= 15) {
    msg91Number = cleaned;
  }

  if (msg91Number) {
    const masked = msg91Number.length > 5 
      ? `+${msg91Number.substring(0, 2)}*****${msg91Number.slice(-4)}`
      : msg91Number;
    return { isValid: true, msg91Number, masked };
  }

  return { isValid: false, msg91Number: cleaned, masked: cleaned };
}

function formatAndValidateIndianPhone(phoneStr) {
  if (!phoneStr) return { isValid: false, normalized: '', masked: '' };

  let cleaned = phoneStr.replace(/[^\d+]/g, '');

  let normalized = '';
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    normalized = `+91${cleaned}`;
  } else if (/^0[6-9]\d{9}$/.test(cleaned)) {
    normalized = `+91${cleaned.substring(1)}`;
  } else if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    normalized = cleaned;
  } else if (/^91[6-9]\d{9}$/.test(cleaned)) {
    normalized = `+${cleaned}`;
  } else if (/^\+\d{10,15}$/.test(cleaned)) {
    normalized = cleaned;
  }

  if (normalized) {
    const masked = normalized.length > 5 
      ? `${normalized.substring(0, 3)}*****${normalized.slice(-4)}`
      : normalized;
    return { isValid: true, normalized, masked };
  }

  return { isValid: false, normalized: cleaned, masked: cleaned };
}

// In-Memory Database Store for Emergency Contacts
let dbEmergencyContacts = [
  {
    id: 'cnt-1',
    userId: 'usr-101',
    name: 'Sunita Sharma (Mother)',
    phone: '+919811122334',
    email: 'sunita.sharma@gmail.com',
    relationship: 'Mother',
    isPrimary: true,
    notifySms: true,
    notifyCall: true,
    notifyEmail: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cnt-2',
    userId: 'usr-101',
    name: 'Rakesh Sharma (Father)',
    phone: '+919811155667',
    email: 'rakesh.sharma@gmail.com',
    relationship: 'Father',
    isPrimary: false,
    notifySms: true,
    notifyCall: true,
    notifyEmail: true,
    createdAt: new Date().toISOString(),
  }
];

let dbEmergencyEvents = [];

// =============================================================================
// EMERGENCY SOS API ENDPOINT (POST /api/emergency/sos)
// =============================================================================
app.post('/api/emergency/sos', sosLimiter, async (req, res) => {
  console.log('\n-----------------------------------------------------------------------------');
  console.log('[SOS] Request received');

  try {
    const { 
      userId = 'usr-101', 
      userName = 'Ananya Sharma', 
      latitude, 
      longitude, 
      location, 
      contacts 
    } = req.body;

    console.log(`[SOS] User authenticated: ${userName} (${userId})`);

    const hasCoordinates = typeof latitude === 'number' && typeof longitude === 'number';
    const lat = hasCoordinates ? latitude : (location && typeof location.lat === 'number' ? location.lat : undefined);
    const lng = hasCoordinates ? longitude : (location && typeof location.lng === 'number' ? location.lng : undefined);

    let mapUrl = '';
    if (typeof lat === 'number' && typeof lng === 'number') {
      mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      console.log(`[SOS] Location acquired: Lat ${lat}, Lng ${lng} (${mapUrl})`);
    } else {
      console.log('[SOS] Location unavailable. Dispatching alert without coordinates.');
    }

    const effectiveContacts = contacts && contacts.length > 0 ? contacts : dbEmergencyContacts;
    console.log(`[SOS] Emergency contacts found: ${effectiveContacts.length}`);

    if (!effectiveContacts || effectiveContacts.length === 0) {
      console.log('[SOS] ERROR: No emergency contacts configured.');
      return res.status(400).json({
        success: false,
        message: 'SMS could not be sent. Please check your emergency contact and SMS configuration.',
        error: 'No emergency contacts configured.',
        sms: { status: 'failed', error: 'No emergency contacts configured' },
        call: { status: 'failed', error: 'No emergency contacts configured' },
      });
    }

    const primaryContact = effectiveContacts.find((c) => c.isPrimary) || effectiveContacts[0];
    effectiveContacts.forEach((c, idx) => {
      const v = formatPhoneForMSG91(c.phone);
      console.log(`[SOS] Contact ${idx + 1}: ${c.name} (${v.masked}) ${c.isPrimary ? '[PRIMARY]' : ''}`);
    });

    const currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Standard Emergency Message String
    const emergencyMessage = mapUrl
      ? `SAFEHER SOS ALERT! ${userName} has triggered an emergency alert. Please contact them immediately. Location: ${mapUrl}`
      : `SAFEHER SOS ALERT! ${userName} has triggered an emergency alert. Please contact them immediately. Time: ${currentTime}`;

    // =========================================================================
    // STEP 1: REAL AUTOMATIC SMS DISPATCH VIA MSG91 API
    // =========================================================================
    let smsSuccessCount = 0;
    let smsPrimaryError = null;
    const smsResults = [];

    if (isMsg91Configured) {
      console.log('[SOS] Sending SMS through MSG91 API...');

      // Prepare recipient mobile list for MSG91 (Format: 91XXXXXXXXXX)
      const validMsg91Recipients = [];
      for (const contact of effectiveContacts) {
        const phoneVal = formatPhoneForMSG91(contact.phone);
        if (!phoneVal.isValid) {
          console.log(`[SOS] Invalid phone number for ${contact.name}: ${contact.phone}`);
          smsResults.push({
            contact: contact.name,
            phone: contact.phone,
            status: 'failed',
            error: 'Invalid Indian phone number format for MSG91.',
          });
          continue;
        }

        validMsg91Recipients.push({
          contact: contact.name,
          msg91Number: phoneVal.msg91Number,
          maskedPhone: phoneVal.masked,
        });
      }

      if (validMsg91Recipients.length > 0) {
        try {
          let msg91ResponseData = null;

          const templateIdToUse = msg91TemplateId || 'emergency_alert';
          console.log(`[SOS] Using MSG91 Flow v5 API with Template ID: ${templateIdToUse}`);

          const flowRecipients = validMsg91Recipients.map((r) => ({
            mobiles: r.msg91Number,
            name: userName,
            location: mapUrl || 'Location unavailable',
            time: currentTime,
          }));

          const flowPayload = {
            template_id: templateIdToUse,
            sender: msg91SenderId || 'SFHERO',
            short_url: "0",
            recipients: flowRecipients,
          };

          const msg91Res = await fetch('https://control.msg91.com/api/v5/flow/', {
            method: 'POST',
            headers: {
              'authkey': msg91AuthKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(flowPayload),
          });

          msg91ResponseData = await msg91Res.json();
          console.log('[SOS] MSG91 Flow API Response:', JSON.stringify(msg91ResponseData));

          if (msg91Res.ok && msg91ResponseData.type === 'success') {
            smsSuccessCount = validMsg91Recipients.length;
          } else {
            smsPrimaryError = msg91ResponseData.message || 'MSG91 Flow API error';
          }

          // Record results for each recipient
          for (const recipient of validMsg91Recipients) {
            if (smsSuccessCount > 0) {
              smsResults.push({
                contact: recipient.contact,
                phone: `+${recipient.msg91Number}`,
                maskedPhone: recipient.maskedPhone,
                status: 'sent',
                sid: msg91ResponseData?.message_id || `MSG91_${Date.now()}`,
              });
            } else {
              smsResults.push({
                contact: recipient.contact,
                phone: `+${recipient.msg91Number}`,
                maskedPhone: recipient.maskedPhone,
                status: 'failed',
                error: smsPrimaryError || 'MSG91 SMS dispatch failed',
              });
            }
          }

        } catch (msg91Err) {
          console.error('[SOS] MSG91 API Fetch Exception:', msg91Err.message);
          smsPrimaryError = msg91Err.message;

          for (const recipient of validMsg91Recipients) {
            smsResults.push({
              contact: recipient.contact,
              phone: `+${recipient.msg91Number}`,
              maskedPhone: recipient.maskedPhone,
              status: 'failed',
              error: msg91Err.message,
            });
          }
        }
      }

    } else {
      console.log('[SOS] ERROR: MSG91 SMS provider is not configured in backend .env.');
      smsPrimaryError = 'MSG91 SMS configuration is missing. Add MSG91_AUTH_KEY, MSG91_TEMPLATE_ID, and MSG91_SENDER_ID to .env';

      for (const contact of effectiveContacts) {
        const phoneVal = formatPhoneForMSG91(contact.phone);
        smsResults.push({
          contact: contact.name,
          phone: contact.phone,
          maskedPhone: phoneVal.masked,
          status: 'failed',
          error: smsPrimaryError,
        });
      }
    }

    // =========================================================================
    // STEP 2: REAL AUTOMATIC PHONE CALL VIA TWILIO VOICE API (PRESERVED)
    // =========================================================================
    let callStatus = 'not_configured';
    let callSid = null;
    let callError = null;

    if (isTwilioVoiceConfigured && twilioClient && primaryContact) {
      const primaryPhoneVal = formatAndValidateIndianPhone(primaryContact.phone);
      if (primaryPhoneVal.isValid) {
        const targetPrimaryNumber = primaryPhoneVal.normalized;
        const maskedPrimaryNumber = primaryPhoneVal.masked;

        console.log(`[SOS] Initiating emergency call to primary contact via Twilio Voice: ${primaryContact.name} (${maskedPrimaryNumber})...`);

        const twimlSayMessage = `<Response><Say voice="alice" language="en-IN">This is a SafeHer emergency alert. ${userName} may be in danger. Please check their location immediately. Their location has been sent by SMS.</Say></Response>`;

        try {
          const callRes = await twilioClient.calls.create({
            twiml: twimlSayMessage,
            from: twilioPhoneNumber,
            to: targetPrimaryNumber,
          });

          callStatus = 'initiated';
          callSid = callRes.sid;
          console.log(`[SOS] Twilio Voice call provider response: SID ${callRes.sid} (Status: ${callRes.status})`);
        } catch (callErr) {
          console.error(`[SOS] Twilio Voice call ERROR for ${primaryContact.name} (${maskedPrimaryNumber}):`, callErr.message);
          callError = callErr.message;
          callStatus = 'failed';
        }
      }
    }

    // =========================================================================
    // STEP 3: AUTOMATIC EMERGENCY EMAIL DISPATCH (WEB3FORMS API & SMTP FALLBACK)
    // =========================================================================
    let emailSuccessCount = 0;
    let emailPrimaryError = null;
    let emailProviderUsed = hasWeb3Forms ? 'Web3Forms' : (isEmailConfigured ? 'SMTP / Nodemailer' : 'None');
    const emailResults = [];

    // Filter contacts with valid emails who have email notifications enabled
    let emailRecipients = effectiveContacts.filter(
      (c) => c.email && c.email.trim() && c.notifyEmail !== false
    );

    // If no contact has an email, but Web3Forms is configured, Web3Forms delivers
    // directly to the inbox registered with WEB3FORMS_ACCESS_KEY.
    // Provide a default recipient entry so the alert sends to that verified inbox.
    if (emailRecipients.length === 0 && hasWeb3Forms) {
      emailRecipients = [{
        name: 'Configured Web3Forms Recipient',
        email: 'emergency@safeher.app',
        isPrimary: true,
      }];
    }

    if (emailRecipients.length > 0) {
      console.log(`[SOS] Dispatching emergency email alert for ${emailRecipients.length} recipient(s)...`);

      const emailSubject = `URGENT: SafeHer Emergency Alert - ${userName}`;
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #f8fafc; margin: 0; padding: 20px; }
    .card { max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 20px; overflow: hidden; border: 2px solid #ef4444; box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.25); }
    .header { background: linear-gradient(135deg, #b91c1c, #e11d48); color: white; padding: 24px; text-align: center; }
    .content { padding: 24px; line-height: 1.6; }
    .btn { display: inline-block; padding: 14px 28px; background-color: #ef4444; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 15px; margin: 20px 0; }
    .info-box { background-color: #1e293b; border-radius: 14px; padding: 16px; margin: 16px 0; border: 1px solid #334155; }
    .footer { font-size: 12px; color: #94a3b8; text-align: center; padding: 16px; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 style="margin:0; font-size: 22px; font-weight: 900; letter-spacing: 0.5px;">🚨 SAFEHER EMERGENCY SOS ALERT 🚨</h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.95;">Immediate Action & Location Notification</p>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;"><strong>${userName}</strong> may be in danger and has triggered an emergency SOS alert.</p>
      
      <div class="info-box">
        <p style="margin: 6px 0;"><strong>👤 User:</strong> ${userName}</p>
        <p style="margin: 6px 0;"><strong>🕒 Trigger Time:</strong> ${currentTime}</p>
        ${lat && lng ? `<p style="margin: 6px 0;"><strong>📍 GPS Coordinates:</strong> ${lat}, ${lng}</p>` : ''}
        <p style="margin: 6px 0;"><strong>🚨 Alert Status:</strong> Active Emergency SOS</p>
      </div>

      ${mapUrl ? `
      <div style="text-align: center;">
        <a href="${mapUrl}" class="btn" target="_blank">📍 Open Live Google Maps Location Pin</a>
      </div>
      ` : ''}

      <p style="font-size: 14px; color: #fca5a5; line-height: 1.5;">Please contact <strong>${userName}</strong> immediately, check their coordinates, or notify emergency services (Police: 112 / Women Helpline: 1091) if needed.</p>
    </div>
    <div class="footer">
      <p style="margin:0;">Dispatched automatically by SafeHer Women Safety Emergency System.</p>
    </div>
  </div>
</body>
</html>`;

      for (const recipient of emailRecipients) {
        let sent = false;

        // 1. Primary: Web3Forms API
        if (hasWeb3Forms) {
          try {
            console.log(`[SOS] Calling Web3Forms API for: ${recipient.name} <${recipient.email}>...`);
            const web3Result = await sendEmergencyEmail({
              recipientEmail: recipient.email.trim(),
              userName,
              latitude: lat,
              longitude: lng,
              timestamp: currentTime,
            });

            if (web3Result.success) {
              sent = true;
              emailSuccessCount++;
              emailProviderUsed = 'Web3Forms';
              console.log(`[SOS] ✅ Web3Forms alert accepted for: ${recipient.name} <${recipient.email}>`);
              emailResults.push({
                contact: recipient.name,
                email: recipient.email,
                status: 'sent',
                provider: 'Web3Forms',
                message: web3Result.message,
              });
            } else {
              console.warn(`[SOS] ⚠️ Web3Forms alert failed for ${recipient.email}: ${web3Result.message}`);
              if (!emailPrimaryError) emailPrimaryError = web3Result.message || web3Result.error;
              emailResults.push({
                contact: recipient.name,
                email: recipient.email,
                status: 'failed',
                provider: 'Web3Forms',
                error: web3Result.message || web3Result.error,
              });
            }
          } catch (web3Err) {
            console.error(`[SOS] ❌ Web3Forms exception for ${recipient.email}:`, web3Err.message);
            if (!emailPrimaryError) emailPrimaryError = web3Err.message;
          }
        }

        // 2. Fallback: SMTP / Nodemailer if Web3Forms was unconfigured or failed and SMTP is configured
        if (!sent && isEmailConfigured && emailTransporter && recipient.email !== 'emergency@safeher.app') {
          try {
            console.log(`[SOS] Attempting SMTP fallback for: ${recipient.name} <${recipient.email}>...`);
            await emailTransporter.sendMail({
              from: emailFrom,
              to: recipient.email.trim(),
              subject: emailSubject,
              text: emergencyMessage,
              html: emailHtml,
            });
            sent = true;
            emailSuccessCount++;
            emailProviderUsed = 'SMTP / Nodemailer';
            console.log(`[SOS] ✅ SMTP emergency email dispatched successfully to: ${recipient.name} <${recipient.email}>`);
            emailResults.push({
              contact: recipient.name,
              email: recipient.email,
              status: 'sent',
              provider: 'SMTP / Nodemailer',
            });
          } catch (mailErr) {
            console.error(`[SOS] ❌ SMTP fallback error for ${recipient.email}:`, mailErr.message);
            if (!emailPrimaryError) emailPrimaryError = mailErr.message;
          }
        }
      }

      if (!hasWeb3Forms && !isEmailConfigured) {
        emailPrimaryError = 'Neither Web3Forms access key nor SMTP credentials are configured in backend .env';
      }
    } else {
      console.log('[SOS] No email recipients configured for this emergency dispatch.');
    }

    const isSmsSuccessful = smsSuccessCount > 0;
    const isEmailSuccessful = emailSuccessCount > 0;
    const isOverallSuccess = isSmsSuccessful || callStatus === 'initiated' || isEmailSuccessful;

    if (isOverallSuccess) {
      console.log('[SOS] SOS emergency dispatch completed successfully.');
    } else {
      console.log('[SOS] SOS emergency dispatch failed.');
    }
    console.log('-----------------------------------------------------------------------------\n');

    const newEmergencyEvent = {
      id: `evt-${Date.now()}`,
      userId,
      userName,
      latitude: lat,
      longitude: lng,
      address: (location && location.address) || (mapUrl ? `Lat: ${lat}, Lng: ${lng}` : 'Location unavailable'),
      timestamp: new Date().toISOString(),
      status: isOverallSuccess ? 'active' : 'failed',
      messageStatus: isSmsSuccessful
        ? `Emergency SMS sent successfully to ${smsSuccessCount}/${effectiveContacts.length} contacts via MSG91`
        : `SMS could not be sent. Please check your emergency contact and SMS configuration.`,
      callStatus: callStatus === 'initiated'
        ? `Call initiated to ${primaryContact?.name || 'Primary Contact'} (SID: ${callSid})`
        : (callError ? `Call dispatch failed: ${callError}` : 'Twilio Voice unconfigured'),
      emailStatus: isEmailSuccessful
        ? `Emergency email sent to ${emailSuccessCount} contact(s) via ${emailProviderUsed}`
        : ((hasWeb3Forms || isEmailConfigured) ? `Email dispatch failed: ${emailPrimaryError}` : 'Email unconfigured'),
      contactsNotifiedCount: smsSuccessCount + emailSuccessCount,
      results: smsResults,
      emailResults,
      emergencyMessage,
    };

    dbEmergencyEvents.unshift(newEmergencyEvent);

    return res.status(isOverallSuccess ? 200 : 400).json({
      success: isOverallSuccess,
      isMsg91Configured,
      isTwilioVoiceConfigured,
      isEmailConfigured: Boolean(hasWeb3Forms || isEmailConfigured),
      isWeb3FormsConfigured: hasWeb3Forms,
      message: isSmsSuccessful 
        ? 'Emergency SMS sent successfully.' 
        : (isEmailSuccessful ? 'Emergency Email sent successfully.' : 'Emergency alert dispatched.'),
      eventId: newEmergencyEvent.id,
      timestamp: newEmergencyEvent.timestamp,
      location: mapUrl ? { lat, lng, address: newEmergencyEvent.address, googleMapsUrl: mapUrl } : null,
      sms: {
        status: isSmsSuccessful ? 'sent' : 'failed',
        provider: 'MSG91',
        sentCount: smsSuccessCount,
        totalCount: effectiveContacts.length,
        error: !isSmsSuccessful ? (smsPrimaryError || 'SMS could not be sent. Please check your emergency contact and SMS configuration.') : undefined,
      },
      call: {
        status: callStatus,
        provider: 'Twilio Voice',
        sid: callSid,
        error: callError || undefined,
        primaryContact: primaryContact ? primaryContact.name : null,
      },
      email: {
        status: isEmailSuccessful ? 'sent' : ((hasWeb3Forms || isEmailConfigured) ? 'failed' : 'not_configured'),
        provider: emailProviderUsed,
        sentCount: emailSuccessCount,
        totalCount: emailRecipients.length > 0 ? emailRecipients.length : 1,
        error: !isEmailSuccessful ? (emailPrimaryError || undefined) : undefined,
        results: emailResults,
      },
      primaryContact: primaryContact ? { name: primaryContact.name, phone: formatAndValidateIndianPhone(primaryContact.phone).masked } : null,
      results: smsResults,
    });

  } catch (err) {
    console.error('[SOS] Backend Server Exception:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Emergency dispatch failed.',
      error: err.message,
      sms: { status: 'failed', error: err.message },
      call: { status: 'failed', error: err.message },
      email: { status: 'failed', error: err.message },
    });
  }
});

// =============================================================================
// EMERGENCY CONTACTS CRUD ENDPOINTS
// =============================================================================
app.get('/api/emergency/contacts', (req, res) => {
  res.json({ success: true, contacts: dbEmergencyContacts });
});

app.post('/api/emergency/contacts', (req, res) => {
  const { name, phone, email, relationship, isPrimary, notifyEmail } = req.body;

  const phoneValidation = formatAndValidateIndianPhone(phone);
  if (!phoneValidation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid mobile phone number format',
      error: 'Please enter a valid 10-digit Indian phone number (+91).',
    });
  }

  if (isPrimary) {
    dbEmergencyContacts.forEach((c) => (c.isPrimary = false));
  }

  const newContact = {
    id: `cnt-${Date.now()}`,
    userId: 'usr-101',
    name: name || 'Emergency Contact',
    phone: phoneValidation.normalized,
    email: (email || '').trim(),
    relationship: relationship || 'Family',
    isPrimary: Boolean(isPrimary) || dbEmergencyContacts.length === 0,
    notifySms: true,
    notifyCall: true,
    notifyEmail: notifyEmail !== false,
    createdAt: new Date().toISOString(),
  };

  dbEmergencyContacts.push(newContact);
  res.status(201).json({ success: true, contact: newContact });
});

app.delete('/api/emergency/contacts/:id', (req, res) => {
  const { id } = req.params;
  dbEmergencyContacts = dbEmergencyContacts.filter((c) => c.id !== id);
  res.json({ success: true, message: 'Contact deleted successfully.' });
});

// =============================================================================
// EMERGENCY EVENT HISTORY ENDPOINT
// =============================================================================
app.get('/api/emergency/history', (req, res) => {
  res.json({ success: true, events: dbEmergencyEvents });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SafeHer MSG91 SMS, Twilio Voice & Web3Forms Emergency Email SOS Backend API',
    isMsg91Configured,
    isTwilioVoiceConfigured,
    isEmailConfigured: Boolean(hasWeb3Forms || isEmailConfigured),
    isWeb3FormsConfigured: hasWeb3Forms,
    mode: isMsg91Configured ? 'Live MSG91 SMS API' : 'MSG91 Unconfigured (Missing Keys in .env)',
  });
});

// Web3Forms Client Proxy Endpoint
// Proxies client-side requests through backend when direct browser preflight is CORS-blocked on localhost
app.post('/api/web3forms/submit', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.access_key) {
      return res.status(400).json({ success: false, message: 'access_key is required' });
    }
    const result = await submitToWeb3Forms(payload);
    if (result.ok && result.data && result.data.success) {
      return res.status(200).json(result.data);
    }
    const status = result.status || (result.data?.success === false ? 400 : 500);
    return res.status(status).json(result.data || { success: false, message: result.error || 'Submission failed' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =============================================================================
// PRODUCTION STATIC FRONTEND SERVING
// =============================================================================
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// For all non-API GET requests, serve React SPA index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SafeHer Emergency SOS Backend Server running on http://localhost:${PORT}`);
});
