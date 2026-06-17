/**
 * src/lib/emailTemplates.js
 * 
 * TrustOnes branded email templates.
 * Used by: auth.service.js (verify email) and forgot-password/route.js (reset password)
 * 
 * IMAGE NOTE:
 * The banner uses a free Unsplash office photo that matches the platform vibe.
 * To use your own image, replace BANNER_IMAGE_URL with a publicly hosted .jpg/.png URL.
 * Recommended size: 640 × 200px, hosted on Cloudinary / S3 / your domain.
 */

const BANNER_IMAGE_URL =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=640&h=200&fit=crop&crop=center&auto=format&q=80";
// ↑ Professional modern office with glass walls — matches your register page photo.
// Replace with your own image URL whenever you want.

const BRAND_NAME   = "TrustOnes";
const BRAND_TAGLINE = "Secure Freelance Platform";
const BRAND_DARK   = "#6b4226";
const BRAND_GOLD   = "#c09535";
const BG_OUTER     = "#e8e4dd";
const BG_CARD      = "#f5f2ed";

/** Shared header: wide image banner + logo overlay */
function emailHeader() {
  return `
  <!-- ══ HERO BANNER ══ -->
  <tr>
    <td style="padding:0;font-size:0;line-height:0;">
      <!--[if mso]>
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"
        style="width:640px;height:200px;">
        <v:fill type="frame" src="${BANNER_IMAGE_URL}" color="#1a1208"/>
        <v:textbox inset="0,0,0,0">
      <![endif]-->
      <div style="
        width:100%;
        max-width:640px;
        height:200px;
        background-color:#1a1208;
        background-image:url('${BANNER_IMAGE_URL}');
        background-size:cover;
        background-position:center;
        position:relative;
        overflow:hidden;
      ">
        <!-- Dark overlay so text stays readable over photo -->
        <div style="
          position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(26,18,8,0.78) 0%,rgba(42,31,20,0.65) 50%,rgba(14,11,6,0.80) 100%);
        "></div>

        <!-- Grid texture -->
        <div style="
          position:absolute;inset:0;opacity:0.06;
          background-image:
            repeating-linear-gradient(0deg,transparent,transparent 30px,#fff 30px,#fff 31px),
            repeating-linear-gradient(90deg,transparent,transparent 30px,#fff 30px,#fff 31px);
        "></div>

        <!-- Centered logo block -->
        <table cellpadding="0" cellspacing="0" width="100%" style="position:relative;z-index:2;height:200px;">
          <tr>
            <td align="center" valign="middle">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <!-- Gold shield icon as inline SVG image -->
                    <div style="
                      width:52px;height:52px;border-radius:50%;
                      background:rgba(192,149,53,0.18);
                      border:1.5px solid rgba(192,149,53,0.45);
                      margin:0 auto 10px;
                      text-align:center;line-height:52px;
                    ">
                      <svg width="24" height="24" fill="none" viewBox="0 0 28 28"
                        style="vertical-align:middle;display:inline-block;">
                        <path d="M14 2L4 6.5v7c0 5.8 4.3 11.2 10 12.5C19.7 24.7 24 19.3 24 13.5v-7L14 2z"
                          stroke="rgba(192,149,53,1)" stroke-width="1.8" stroke-linejoin="round"/>
                        <path d="M9.5 14l3 3 6-6"
                          stroke="rgba(192,149,53,1)" stroke-width="1.8"
                          stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="
                      font-family:'Helvetica Neue',Arial,sans-serif;
                      font-size:28px;font-weight:800;
                      color:#f5f2ed;letter-spacing:-0.02em;
                    ">Trust<span style="color:${BRAND_GOLD};">Ones</span></span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:12px;">
                    <span style="
                      font-family:'Helvetica Neue',Arial,sans-serif;
                      font-size:11px;color:rgba(255,255,255,0.50);
                      letter-spacing:0.12em;text-transform:uppercase;
                    ">${BRAND_TAGLINE}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
      <!--[if mso]></v:textbox></v:rect><![endif]-->
    </td>
  </tr>`;
}

/** Shared footer */
function emailFooter(toEmail) {
  return `
  <!-- ══ FOOTER ══ -->
  <tr>
    <td style="padding:20px 48px 36px;">
      <hr style="border:none;border-top:1px solid #e4e0d8;margin:0 0 20px;" />
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:800;color:#18160f;letter-spacing:-0.01em;">
              Trust<span style="color:${BRAND_GOLD};">Ones</span>
            </span>
            <p style="margin:4px 0 0;font-size:12px;color:#9c9890;font-family:'Helvetica Neue',Arial,sans-serif;">
              Secure Freelance Escrow Platform
            </p>
          </td>
          <td align="right" valign="top">
            <p style="margin:0;font-size:11px;color:#b8b4ae;line-height:1.65;font-family:'Helvetica Neue',Arial,sans-serif;">
              Sent to <strong style="color:#9c9890;">${toEmail}</strong>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

/** Shared outer wrapper */
function wrapEmail(innerRows) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
</head>
<body style="margin:0;padding:0;background:${BG_OUTER};font-family:'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
    style="background:${BG_OUTER};padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="640" cellpadding="0" cellspacing="0" role="presentation"
          style="max-width:640px;width:100%;background:${BG_CARD};border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.12);">
          ${innerRows}
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/* ─────────────────────────────────────────────
   TEMPLATE 1 — Password Reset Email
───────────────────────────────────────────── */
export function resetPasswordEmail({ userName, email, resetUrl }) {
  const content = `
  ${emailHeader()}

  <!-- ══ BODY ══ -->
  <tr>
    <td style="padding:40px 48px 24px;">

      <!-- Badge -->
      <div style="
        display:inline-block;
        background:#ebe6de;border:1px solid #d8d2c8;
        border-radius:20px;padding:5px 14px;
        font-family:'Helvetica Neue',Arial,sans-serif;
        font-size:11px;font-weight:600;color:#7c5c3e;
        letter-spacing:0.08em;text-transform:uppercase;
        margin-bottom:24px;
      ">&#128274; Password Reset</div>

      <h1 style="
        margin:0 0 12px;
        font-family:'Helvetica Neue',Arial,sans-serif;
        font-size:28px;font-weight:800;
        color:#18160f;letter-spacing:-0.025em;line-height:1.15;
      ">Reset your password</h1>

      <p style="margin:0 0 6px;font-size:15px;color:#635f57;line-height:1.7;font-family:'Helvetica Neue',Arial,sans-serif;">
        Hi <strong style="color:#18160f;">${userName}</strong>,
      </p>
      <p style="margin:0 0 28px;font-size:15px;color:#635f57;line-height:1.7;font-family:'Helvetica Neue',Arial,sans-serif;">
        We received a request to reset your <strong style="color:#18160f;">TrustOnes</strong> account password.
        Click the button below to set a new password securely.
      </p>

      <!-- CTA button -->
      <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
        <tr>
          <td style="border-radius:10px;background:${BRAND_DARK};">
            <a href="${resetUrl}" style="
              display:inline-block;padding:14px 36px;
              font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:15px;font-weight:700;
              color:#ffffff;text-decoration:none;
              border-radius:10px;letter-spacing:0.01em;
            ">Reset My Password &#8594;</a>
          </td>
        </tr>
      </table>

      <!-- Fallback link -->
      <p style="margin:0 0 24px;font-size:12px;color:#9c9890;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">
        Or copy this link into your browser:<br/>
        <a href="${resetUrl}" style="color:${BRAND_GOLD};word-break:break-all;">${resetUrl}</a>
      </p>

      <hr style="border:none;border-top:1px solid #e4e0d8;margin:0 0 20px;" />

      <!-- Warning box -->
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-bottom:4px;">
        <tr>
          <td style="background:#fdf8ee;border:1px solid #e8d89a;border-radius:10px;padding:14px 18px;">
            <p style="margin:0;font-size:13px;color:#7c5c3e;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">
              &#9888;&#65039; <strong>This link expires in 30 minutes</strong> and can only be used once.
              If you didn't request this, you can safely ignore this email — your password won't change.
            </p>
          </td>
        </tr>
      </table>

    </td>
  </tr>

  ${emailFooter(email)}`;

  return wrapEmail(content);
}

/* ─────────────────────────────────────────────
   TEMPLATE 2 — Email Verification
───────────────────────────────────────────── */
export function verifyEmailTemplate({ userName, email, verifyUrl }) {
  const content = `
  ${emailHeader()}

  <!-- ══ BODY ══ -->
  <tr>
    <td style="padding:40px 48px 24px;">

      <!-- Badge -->
      <div style="
        display:inline-block;
        background:#ebe6de;border:1px solid #d8d2c8;
        border-radius:20px;padding:5px 14px;
        font-family:'Helvetica Neue',Arial,sans-serif;
        font-size:11px;font-weight:600;color:#7c5c3e;
        letter-spacing:0.08em;text-transform:uppercase;
        margin-bottom:24px;
      ">&#9993;&#65039; Email Verification</div>

      <h1 style="
        margin:0 0 12px;
        font-family:'Helvetica Neue',Arial,sans-serif;
        font-size:28px;font-weight:800;
        color:#18160f;letter-spacing:-0.025em;line-height:1.15;
      ">Verify your email</h1>

      <p style="margin:0 0 6px;font-size:15px;color:#635f57;line-height:1.7;font-family:'Helvetica Neue',Arial,sans-serif;">
        Hi <strong style="color:#18160f;">${userName}</strong>,
      </p>
      <p style="margin:0 0 28px;font-size:15px;color:#635f57;line-height:1.7;font-family:'Helvetica Neue',Arial,sans-serif;">
        Welcome to <strong style="color:#18160f;">TrustOnes</strong>! Please verify your email address
        to activate your account and start working with trust.
      </p>

      <!-- CTA button -->
      <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
        <tr>
          <td style="border-radius:10px;background:${BRAND_DARK};">
            <a href="${verifyUrl}" style="
              display:inline-block;padding:14px 36px;
              font-family:'Helvetica Neue',Arial,sans-serif;
              font-size:15px;font-weight:700;
              color:#ffffff;text-decoration:none;
              border-radius:10px;letter-spacing:0.01em;
            ">Verify My Email &#8594;</a>
          </td>
        </tr>
      </table>

      <!-- Fallback link -->
      <p style="margin:0 0 24px;font-size:12px;color:#9c9890;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">
        Or copy this link into your browser:<br/>
        <a href="${verifyUrl}" style="color:${BRAND_GOLD};word-break:break-all;">${verifyUrl}</a>
      </p>

      <hr style="border:none;border-top:1px solid #e4e0d8;margin:0 0 20px;" />

      <!-- Warning box -->
      <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-bottom:4px;">
        <tr>
          <td style="background:#fdf8ee;border:1px solid #e8d89a;border-radius:10px;padding:14px 18px;">
            <p style="margin:0;font-size:13px;color:#7c5c3e;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">
              &#9888;&#65039; <strong>This link expires in 1 hour.</strong>
              If you didn't create a TrustOnes account, you can safely ignore this email.
            </p>
          </td>
        </tr>
      </table>

    </td>
  </tr>

  ${emailFooter(email)}`;

  return wrapEmail(content);
}