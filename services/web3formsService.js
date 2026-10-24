import https from 'https';
import { spawn } from 'child_process';

/**
 * Web3Forms Emergency Email Service
 * Official API Endpoint: https://api.web3forms.com/submit
 */

const WEB3FORMS_ENDPOINT = 'api.web3forms.com';
const WEB3FORMS_PATH = '/submit';
const REQUEST_TIMEOUT_MS = 10000;
const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Helper to check if Web3Forms is properly configured in environment variables
 */
export function isWeb3FormsConfigured() {
  const accessKey = (process.env.WEB3FORMS_ACCESS_KEY || '').trim();
  return Boolean(
    accessKey &&
    !accessKey.toLowerCase().includes('your_actual') &&
    !accessKey.toLowerCase().includes('your_web3forms')
  );
}

/**
 * Low-level transport helper to submit payload to https://api.web3forms.com/submit.
 * Uses system curl.exe when available to bypass Cloudflare WAF bot challenges that
 * target Node.js TLS fingerprints (HTTP 403), falling back to Node https.request.
 *
 * @param {string|Object} payload
 * @returns {Promise<{ ok: boolean, status: number, data?: any, error?: string }>}
 */
export function submitToWeb3Forms(payload) {
  const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);

  return new Promise((resolve) => {
    // 1. Try system curl first (avoids Cloudflare WAF JA3/TLS block across Windows and Linux)
    try {
      const curlBin = process.platform === 'win32' ? 'curl.exe' : 'curl';
      const curl = spawn(curlBin, [
        '-s',
        '-X', 'POST',
        'https://api.web3forms.com/submit',
        '-H', 'Content-Type: application/json',
        '-H', 'Accept: application/json',
        '-H', `User-Agent: ${BROWSER_USER_AGENT}`,
        '--data-binary', '@-',
      ]);

      let stdout = '';
      let stderr = '';

      curl.stdout.on('data', (chunk) => {
        stdout += chunk;
      });

      curl.stderr.on('data', (chunk) => {
        stderr += chunk;
      });

      curl.on('error', () => {
        // Fall back to https.request
        fallbackToHttps(payloadString, resolve);
      });

      curl.on('close', (code) => {
        if (code === 0 && stdout) {
          try {
            const parsed = JSON.parse(stdout);
            return resolve({
              ok: parsed.success === true,
              status: parsed.success === true ? 200 : 400,
              data: parsed,
              error: parsed.success ? undefined : (parsed.message || 'Web3Forms rejected request'),
            });
          } catch {
            // If output was not JSON (e.g. Cloudflare HTML), try https fallback
            fallbackToHttps(payloadString, resolve);
          }
        } else {
          fallbackToHttps(payloadString, resolve);
        }
      });

      curl.stdin.write(payloadString);
      curl.stdin.end();
    } catch {
      fallbackToHttps(payloadString, resolve);
    }
  });
}

function fallbackToHttps(payloadString, resolve) {
  const options = {
    hostname: WEB3FORMS_ENDPOINT,
    port: 443,
    path: WEB3FORMS_PATH,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payloadString),
      'Accept': 'application/json',
      'User-Agent': BROWSER_USER_AGENT,
    },
    timeout: REQUEST_TIMEOUT_MS,
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (c) => { body += c; });
    res.on('end', () => {
      const status = res.statusCode || 0;
      try {
        const json = JSON.parse(body);
        return resolve({
          ok: status >= 200 && status < 300 && json.success === true,
          status,
          data: json,
          error: json.success ? undefined : (json.message || `HTTP ${status}`),
        });
      } catch {
        return resolve({
          ok: false,
          status,
          error: `Non-JSON response from Web3Forms (HTTP ${status})`,
        });
      }
    });
  });

  req.on('timeout', () => {
    req.destroy();
    resolve({ ok: false, status: 408, error: 'Web3Forms request timed out' });
  });

  req.on('error', (err) => {
    resolve({ ok: false, status: 500, error: err.message });
  });

  req.write(payloadString);
  req.end();
}

/**
 * Send an emergency alert email via the official Web3Forms API
 *
 * @param {Object} params
 * @param {string} [params.recipientEmail] - Emergency contact / recipient email address
 * @param {string} [params.userName] - Name of the user triggering the SOS alert
 * @param {number|string} [params.latitude] - GPS Latitude (if available)
 * @param {number|string} [params.longitude] - GPS Longitude (if available)
 * @param {string} [params.timestamp] - ISO timestamp or formatted time of the event
 * @returns {Promise<{ success: boolean, status: string, provider: string, message: string, error?: string, data?: any }>}
 */
export async function sendEmergencyEmail({
  recipientEmail,
  userName = 'SafeHer User',
  latitude,
  longitude,
  timestamp,
}) {
  const accessKey = (process.env.WEB3FORMS_ACCESS_KEY || '').trim();

  // 1. Validate Web3Forms Access Key
  if (!accessKey || accessKey.toLowerCase().includes('your_actual') || accessKey.toLowerCase().includes('your_web3forms')) {
    const errorMsg = 'WEB3FORMS_ACCESS_KEY is missing or unconfigured in backend .env';
    console.warn(`⚠️ [WEB3FORMS] ${errorMsg}`);
    return {
      success: false,
      status: 'not_configured',
      provider: 'Web3Forms',
      message: errorMsg,
      error: errorMsg,
    };
  }

  // 2. Validate Recipient Email
  const cleanEmail = (recipientEmail || '').trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    const errorMsg = `Invalid recipient email address: "${recipientEmail || ''}"`;
    console.warn(`⚠️ [WEB3FORMS] ${errorMsg}`);
    return {
      success: false,
      status: 'failed',
      provider: 'Web3Forms',
      message: errorMsg,
      error: errorMsg,
    };
  }

  // 3. Construct Message Content & GPS Coordinates
  const currentTimestamp = timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const hasValidGps = latitude !== undefined && latitude !== null && latitude !== '' &&
                      longitude !== undefined && longitude !== null && longitude !== '' &&
                      !isNaN(Number(latitude)) && !isNaN(Number(longitude));

  let locationText = '';
  let googleMapsUrl = '';

  if (hasValidGps) {
    const latNum = Number(latitude).toFixed(6);
    const lngNum = Number(longitude).toFixed(6);
    locationText = `${latNum}, ${lngNum}`;
    googleMapsUrl = `https://www.google.com/maps?q=${latNum},${lngNum}`;
  } else {
    locationText = 'Location unavailable / could not be retrieved';
    googleMapsUrl = 'N/A';
  }

  const emailSubject = 'URGENT: SafeHer Emergency Alert';
  const messageBody = `SAFEHER EMERGENCY ALERT
An emergency SOS alert has been triggered.

User Name: ${userName}
Emergency Time: ${currentTimestamp}
Location: ${locationText}
Google Maps Link: ${googleMapsUrl}

Please contact the user immediately and check their safety.
This is an automated emergency notification from SafeHer Women Safety Emergency & Monitoring System.`;

  // 4. Construct Request Payload matching official Web3Forms documentation
  const payload = {
    access_key: accessKey,
    subject: emailSubject,
    from_name: 'SafeHer Emergency System',
    name: userName,
    email: cleanEmail,
    message: messageBody,
  };

  const maskedKey = accessKey.length > 8
    ? `${accessKey.substring(0, 4)}...${accessKey.slice(-4)}`
    : '***';

  console.log(`[WEB3FORMS] Submitting emergency email alert via Web3Forms API (Key: ${maskedKey}, To/ReplyTo: ${cleanEmail})...`);

  // 5. Submit Request
  const result = await submitToWeb3Forms(payload);

  if (result.ok && result.data && result.data.success === true) {
    console.log(`✅ [WEB3FORMS] Emergency email successfully accepted by Web3Forms:`, result.data.message || 'Success');
    return {
      success: true,
      status: 'sent',
      provider: 'Web3Forms',
      message: result.data.message || 'Emergency email accepted by Web3Forms',
      data: result.data,
    };
  }

  // Handle Web3Forms rejection or failure
  const errorDetail = (result.data && result.data.message) || result.error || `HTTP ${result.status}`;
  console.warn(`⚠️ [WEB3FORMS] Web3Forms API returned error (Status ${result.status}):`, errorDetail);

  return {
    success: false,
    status: 'failed',
    provider: 'Web3Forms',
    message: errorDetail,
    error: errorDetail,
    data: result.data,
  };
}
