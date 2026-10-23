/**
 * Web3Forms Client-Side Emergency Email Service
 * Official Documentation: https://docs.web3forms.com/getting-started/api-reference
 * Official Endpoint: https://api.web3forms.com/submit
 */

export interface SendClientEmailParams {
  userName: string;
  latitude?: number | null;
  longitude?: number | null;
  timestamp?: string;
}

export interface Web3FormsClientResult {
  success: boolean;
  status: 'sent' | 'failed' | 'not_configured';
  provider: string;
  message: string;
  error?: string;
  data?: any;
}

// Access Key from Vite environment or configured default
const CONFIGURED_ACCESS_KEY = (
  (import.meta as any)?.env?.VITE_WEB3FORMS_ACCESS_KEY ||
  '4ea22d9d-62bd-4a8d-8309-ab8eba712c0d'
).trim();

// Debounce state to prevent duplicate submissions
let lastSubmissionTime = 0;
let isSubmitting = false;

/**
 * Sends emergency alert email directly from the client using the official Web3Forms API.
 * Follows Web3Forms documentation specifications:
 * - Endpoint: https://api.web3forms.com/submit
 * - Fields: access_key, subject, from_name, name, message
 * - Checks BOTH response.ok and result.success
 */
export async function sendClientEmergencyEmail(
  params: SendClientEmailParams
): Promise<Web3FormsClientResult> {
  const now = Date.now();

  // Prevent duplicate submissions within 3 seconds
  if (isSubmitting || now - lastSubmissionTime < 3000) {
    console.warn('[WEB3FORMS CLIENT] Duplicate email submission prevented by debounce.');
    return {
      success: false,
      status: 'failed',
      provider: 'Web3Forms',
      message: 'Duplicate submission prevented. Please wait a moment before sending again.',
      error: 'Duplicate submission prevented',
    };
  }

  // Validate Access Key
  if (!CONFIGURED_ACCESS_KEY || CONFIGURED_ACCESS_KEY.includes('your_actual')) {
    const errorMsg = 'Web3Forms Access Key is missing or unconfigured. Please configure VITE_WEB3FORMS_ACCESS_KEY in .env.';
    console.error(`[WEB3FORMS CLIENT] ${errorMsg}`);
    return {
      success: false,
      status: 'not_configured',
      provider: 'Web3Forms',
      message: errorMsg,
      error: errorMsg,
    };
  }

  isSubmitting = true;
  lastSubmissionTime = now;

  try {
    const { userName, latitude, longitude, timestamp } = params;

    // 1. Format Time
    const currentTimestamp =
      timestamp ||
      new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'medium',
      });

    // 2. Format Location & Google Maps Link
    const hasCoordinates =
      latitude !== undefined &&
      latitude !== null &&
      !isNaN(Number(latitude)) &&
      longitude !== undefined &&
      longitude !== null &&
      !isNaN(Number(longitude));

    const locationText = hasCoordinates
      ? `${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}`
      : 'Location could not be retrieved';

    const googleMapsUrl = hasCoordinates
      ? `https://www.google.com/maps?q=${Number(latitude).toFixed(6)},${Number(longitude).toFixed(6)}`
      : 'N/A';

    // 3. Construct Message according to required format
    const emergencyMessage = `SAFEHER EMERGENCY ALERT
An emergency SOS has been triggered.
User: ${userName || 'SafeHer User'}
Time: ${currentTimestamp}
Location: ${locationText}
Google Maps: ${googleMapsUrl}
Please contact the user immediately and check their safety.`;

    const requestPayload = {
      access_key: CONFIGURED_ACCESS_KEY,
      subject: 'URGENT: SafeHer Emergency Alert',
      from_name: 'SafeHer Emergency System',
      name: userName || 'SafeHer User',
      message: emergencyMessage,
    };

    console.log('[WEB3FORMS CLIENT] Submitting emergency email alert to Web3Forms API...', {
      userName,
      hasCoordinates,
      endpoint: 'https://api.web3forms.com/submit',
    });

    let response: Response;
    let result: any = null;

    // Primary Attempt: Direct client-side fetch to official Web3Forms API
    try {
      response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      result = await response.json();
    } catch (networkErr: any) {
      console.warn('[WEB3FORMS CLIENT] Direct fetch failed (possible local CORS/network restriction), attempting proxy fallback...', networkErr.message);

      // Fallback: If browser preflight/CORS blocks direct localhost fetch, attempt via local backend proxy
      try {
        response = await fetch('/api/web3forms/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(requestPayload),
        });
        result = await response.json();
      } catch (fallbackErr: any) {
        throw new Error(networkErr.message || fallbackErr.message || 'Network request failed');
      }
    }

    console.log('[WEB3FORMS CLIENT] Web3Forms response status:', response.status, 'Body:', result);

    // STEP 3 Requirement: Check BOTH response.ok and result.success
    if (response.ok && result && result.success === true) {
      console.log('✅ [WEB3FORMS CLIENT] Emergency email sent successfully via Web3Forms:', result.message);
      return {
        success: true,
        status: 'sent',
        provider: 'Web3Forms',
        message: result.message || 'Emergency email sent successfully via Web3Forms.',
        data: result,
      };
    }

    // Handle Web3Forms rejection or errors
    const errorMessage =
      (result && result.message) ||
      `Web3Forms request rejected (HTTP ${response.status})`;

    console.error('❌ [WEB3FORMS CLIENT] Web3Forms API returned failure:', errorMessage);

    return {
      success: false,
      status: 'failed',
      provider: 'Web3Forms',
      message: errorMessage,
      error: errorMessage,
      data: result,
    };
  } catch (err: any) {
    console.error('❌ [WEB3FORMS CLIENT] Request exception:', err.message);
    const errorDetail = err.message.includes('Failed to fetch')
      ? 'Network / CORS connection error connecting to Web3Forms API.'
      : err.message;

    return {
      success: false,
      status: 'failed',
      provider: 'Web3Forms',
      message: errorDetail,
      error: errorDetail,
    };
  } finally {
    isSubmitting = false;
  }
}
