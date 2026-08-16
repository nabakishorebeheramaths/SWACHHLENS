const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "onboarding@resend.dev";


const sendViaResend = async ({
  to,
  subject,
  text,
  html,
}) => {

  try {

    const result =
      await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: [to],
        subject,
        text,
        html,
      });

    if (result.error) {
      throw new Error(
        result.error.message ||
        "Resend email sending failed."
      );
    }

    return {
      success: true,
      messageId:
        result.data?.id || null,
    };

  } catch (error) {

    console.error(
      "❌ Resend Email Error:",
      error
    );

    return {
      success: false,
      message:
        error.message ||
        "Failed to send email.",
      messageId: null,
    };
  }
};
const crypto = require("crypto");

// =====================================================
// OTP STORE
// =====================================================

const otpStore = new Map();


// =====================================================
// SEND EMAIL OTP
// =====================================================

const sendEmailOTP = async (email) => {
  const normalizedEmail =
    email.trim().toLowerCase();

  const otp =
    crypto.randomInt(
      100000,
      1000000
    ).toString();

  const mailOptions = {
    from:
      `"SWACHHLENS" <${process.env.EMAIL_USER}>`,

    to:
      normalizedEmail,

    subject:
      "SWACHHLENS Email Verification OTP",

    text:
      `Your SWACHHLENS verification OTP is ${otp}. It is valid for 5 minutes.`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 12px;
      ">

        <h2>♻️ SWACHHLENS</h2>

        <h3>Email Verification</h3>

        <p>
          Your verification OTP is:
        </p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 25px 0;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for
          <strong>5 minutes</strong>.
        </p>

        <p>
          If you did not request this OTP,
          please ignore this email.
        </p>

        <hr />

        <small>
          SWACHHLENS — AI Waste-Response
          Intelligence System
        </small>

      </div>
    `,
  };

  try {
    console.log(
      `📤 Sending OTP to: ${normalizedEmail}`
    );

    const emailResult =
  await sendViaResend({
    to: normalizedEmail,
    subject: mailOptions.subject,
    text: mailOptions.text,
    html: mailOptions.html,
  });

if (!emailResult.success) {
  throw new Error(
    emailResult.message ||
    "Failed to send OTP email."
  );
}

    // =============================================
    // IMPORTANT:
    // Store OTP ONLY after Gmail accepts the mail
    // =============================================

    otpStore.set(
      normalizedEmail,
      {
        otp,

        expiresAt:
          Date.now() +
          5 * 60 * 1000,

        messageId:
          info.messageId,

        createdAt:
          Date.now(),
      }
    );

    console.log(
      `✅ OTP sent successfully to ${normalizedEmail}`
    );

    console.log(
      `📨 Message ID: ${info.messageId}`
    );

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {

    // Do NOT keep a failed OTP
    otpStore.delete(
      normalizedEmail
    );

    console.error(
      `❌ OTP SEND FAILED for ${normalizedEmail}`
    );

    console.error(
      "Error code:",
      error.code
    );

    console.error(
      "Error message:",
      error.message
    );

    console.error(
      "SMTP response:",
      error.response || "N/A"
    );

    throw error;
  }
};

// =====================================================
// VERIFY EMAIL OTP
// =====================================================

const verifyEmailOTP = (
  email,
  otp
) => {

  const key =
    email.trim().toLowerCase();

  const record =
    otpStore.get(key);

  if (!record) {
    return {
      success: false,

      message:
        "OTP not found. Please request a new OTP.",
    };
  }

  if (
    Date.now() >
    record.expiresAt
  ) {

    otpStore.delete(key);

    return {
      success: false,

      message:
        "OTP expired. Please request a new OTP.",
    };
  }

  if (
    record.otp !==
    String(otp).trim()
  ) {

    return {
      success: false,

      message:
        "Invalid OTP.",
    };
  }

  otpStore.delete(key);

  return {
    success: true,

    message:
      "Email verified successfully.",
  };
};

// =====================================================
// SEND WASTE REPORT EMAIL
// =====================================================

const sendWasteReportEmail = async ({
  email,
  citizenName,
  reportId,
  imagePath,
  wasteType,
  category,
  visibleSeverity,
  estimatedQuantity,
  hazardDetected,
  roadBlockage,
  riskScore,
  priority,
  recommendedAction,
  description,
  wasteLocation,
  reportDate,
  trackingUrl,
  
}) => {

  const normalizedEmail =
    email.trim().toLowerCase();

  const mailOptions = {

    from:
      `"SWACHHLENS" <${process.env.EMAIL_USER}>`,

    to:
      normalizedEmail,

    subject:
      `SWACHHLENS Report Confirmation — ${reportId}`,
  attachments: imagePath
    ? [
        {
          filename: "reported-waste-image.jpg",
          path: imagePath,
          cid: "swachhlens-waste-image",
        },
      ]
    : [],
    // =================================================
    // PLAIN TEXT EMAIL
    // =================================================

    text: `
Dear ${citizenName || "Citizen"},

Thank you for submitting your waste report through SWACHHLENS.

Your report has been successfully registered.

Report ID: ${reportId}

Waste Type: ${wasteType || "Not available"}
Category: ${category || "Not available"}
Severity: ${visibleSeverity || "Not available"}
Estimated Quantity: ${estimatedQuantity || "Not available"}

Hazard Detected:
${hazardDetected ? "Yes" : "No"}

Road Blockage:
${roadBlockage ? "Yes" : "No"}

Risk Score:
${riskScore ?? "Not available"}

Priority:
${priority || "Not available"}

Description:
${description || "Not available"}

Recommended Action:
${
  recommendedAction ||
  "Our response team will assess the situation."
}

Waste Location:
${wasteLocation || "Not available"}

Report Date:
${
  reportDate ||
  new Date().toLocaleString("en-IN")
}

Your information is our responsibility.

Thank you for trusting SWACHHLENS.

We will make every effort to resolve your reported issue as soon as possible and keep you informed about its progress.

You can also check the status of your report anytime through our SWACHHLENS platform using your Report ID.

${
  trackingUrl
    ? `
Track your report:
${trackingUrl}

Click the link above to view your report status and analysis.
`
    : ""
}

Regards,

SWACHHLENS Team
AI Waste-Response Intelligence System
`,

    // =================================================
    // HTML EMAIL
    // =================================================

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 650px;
        margin: auto;
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 14px;
        background: #ffffff;
      ">

        <!-- HEADER -->

        <h2 style="
          margin-bottom: 5px;
        ">
          ♻️ SWACHHLENS
        </h2>

        <p style="
          color: #666;
          margin-top: 0;
        ">
          AI Waste-Response Intelligence System
        </p>

        <hr />

        <!-- SUCCESS -->

        <h3>
          ✅ Waste Report Successfully Registered
        </h3>

        <p>
          Dear
          <strong>
            ${citizenName || "Citizen"}
          </strong>,
        </p>

        <p>
          Thank you for submitting your waste report
          through <strong>SWACHHLENS</strong>.
        </p>

        <!-- REPORT ID -->

        <div style="
          background: #f3f7f4;
          border-radius: 10px;
          padding: 18px;
          margin: 20px 0;
          text-align: center;
        ">

          <div style="
            font-size: 13px;
            color: #666;
          ">
            YOUR REPORT ID
          </div>

          <div style="
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-top: 8px;
          ">
            ${reportId}
          </div>

        </div>
<!-- REPORTED WASTE IMAGE -->

<h3>
  🖼️ Reported Waste Image
</h3>

<div style="
  text-align: center;
  margin: 20px 0;
">

  <img
    src="cid:swachhlens-waste-image"
    alt="Reported Waste Image"
    style="
      max-width: 100%;
      width: 550px;
      max-height: 450px;
      object-fit: contain;
      border-radius: 12px;
      border: 1px solid #ddd;
    "
  />

</div>
        <!-- REPORT DETAILS -->

        <h3>
          📋 Report Details
        </h3>

        <table style="
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        ">

          <tr>
            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              <strong>Waste Type</strong>
            </td>

            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              ${wasteType || "Not available"}
            </td>
          </tr>

          <tr>
            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              <strong>Category</strong>
            </td>

            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              ${category || "Not available"}
            </td>
          </tr>

          <tr>
            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              <strong>Severity</strong>
            </td>

            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              ${visibleSeverity || "Not available"}
            </td>
          </tr>

          <tr>
            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              <strong>Estimated Quantity</strong>
            </td>

            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              ${estimatedQuantity || "Not available"}
            </td>
          </tr>

          <tr>
            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              <strong>Hazard Detected</strong>
            </td>

            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              ${hazardDetected ? "Yes" : "No"}
            </td>
          </tr>

          <tr>
            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              <strong>Road Blockage</strong>
            </td>

            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              ${roadBlockage ? "Yes" : "No"}
            </td>
          </tr>

          <tr>
            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              <strong>Risk Score</strong>
            </td>

            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              ${riskScore ?? "Not available"}
            </td>
          </tr>

          <tr>
            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              <strong>Priority</strong>
            </td>

            <td style="
              padding: 8px;
              border-bottom: 1px solid #eee;
            ">
              ${priority || "Not available"}
            </td>
          </tr>

        </table>

        <!-- DESCRIPTION -->

        <h3>
          📝 AI Analysis Summary
        </h3>

        <p style="
          background: #f8f8f8;
          padding: 14px;
          border-radius: 8px;
          line-height: 1.6;
        ">
          ${description || "Not available"}
        </p>

        <!-- RECOMMENDED ACTION -->

        <h3>
          💡 Recommended Action
        </h3>

        <p style="
          background: #f8f8f8;
          padding: 14px;
          border-radius: 8px;
          line-height: 1.6;
        ">
          ${
            recommendedAction ||
            "Our response team will assess the situation."
          }
        </p>

        <!-- LOCATION -->

        <h3>
          📍 Waste Location
        </h3>

        <p>
          ${wasteLocation || "Not available"}
        </p>

        <p>
          <strong>Report Date:</strong>
          ${
            reportDate ||
            new Date().toLocaleString("en-IN")
          }
        </p>

        <hr />

        <!-- RESPONSIBILITY MESSAGE -->

        <div style="
          background: #f3f7f4;
          padding: 18px;
          border-radius: 10px;
          margin-top: 20px;
          line-height: 1.6;
        ">

          <strong>
            🤝 Your Information Is Our Responsibility
          </strong>

          <p>
            Thank you for trusting
            <strong>SWACHHLENS</strong>.
            We will make every effort to resolve your
            reported issue as soon as possible and keep
            you informed about its progress.
          </p>

          <p>
            You can also check the status of your report
            anytime through our SWACHHLENS platform using
            your <strong>Report ID</strong>.
          </p>

        </div>


        <!-- TRACK REPORT BUTTON -->

        ${
          trackingUrl
            ? `
              <div style="
                text-align: center;
                margin: 25px 0;
              ">

                <a
                  href="${trackingUrl}"
                  style="
                    display: inline-block;
                    padding: 12px 22px;
                    background: #111;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                  "
                >
                  🔎 Track Your Report
                </a>

              </div>
            `
            : ""
        }

      <!-- FOOTER -->

        <hr />

        <p style="
          font-size: 12px;
          color: #777;
          text-align: center;
        ">
          SWACHHLENS — AI Waste-Response Intelligence System
        </p>

      </div>
    `,
  };

  // ===================================================
  // SEND EMAIL
  // ===================================================

  try {

    console.log(
      `📤 Sending waste report email to: ${normalizedEmail}`
    );

    console.log(
      `🆔 Report ID: ${reportId}`
    );

   const emailResult =
  await sendViaResend({
    to: normalizedEmail,
    subject: mailOptions.subject,
    text: mailOptions.text,
    html: mailOptions.html,
  });

if (!emailResult.success) {
  throw new Error(
    emailResult.message ||
    "Failed to send email."
  );
}

    console.log(
      `✅ Waste report email sent successfully to ${normalizedEmail}`
    );

    console.log(
      `📨 Message ID: ${info.messageId}`
    );

    return {
      success: true,
      messageId:
        info.messageId,
    };

  } catch (error) {

    console.error(
      `❌ WASTE REPORT EMAIL FAILED for ${normalizedEmail}`
    );

    console.error(
      "Error code:",
      error.code
    );

    console.error(
      "Error message:",
      error.message
    );

    console.error(
      "SMTP response:",
      error.response || "N/A"
    );

    return {
      success: false,
      message:
        error.message,
    };
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  sendEmailOTP,
  verifyEmailOTP,
  sendWasteReportEmail,
};