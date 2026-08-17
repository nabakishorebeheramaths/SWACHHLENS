const fs = require("fs");
const crypto = require("crypto");

// =====================================================
// BREVO HTTP EMAIL API
// =====================================================

const sendViaBrevo = async ({
  to,
  subject,
  text,
  html,
  attachments = [],
}) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error(
        "BREVO_API_KEY is not configured."
      );
    }

    if (!process.env.BREVO_SENDER_EMAIL) {
      throw new Error(
        "BREVO_SENDER_EMAIL is not configured."
      );
    }

    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key":
            process.env.BREVO_API_KEY,
          "content-type":
            "application/json",
        },
        body: JSON.stringify({
          sender: {
            name:
              process.env.BREVO_SENDER_NAME ||
              "SWACHHLENS",
            email:
              process.env.BREVO_SENDER_EMAIL,
          },

          to: [
            {
              email: to,
            },
          ],

          subject,

          textContent:
            text || "",

          htmlContent:
            html || "",

          attachments:
            attachments || [],
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
        "Brevo email sending failed."
      );
    }

    console.log(
      `âœ… Brevo email sent to: ${to}`
    );

    return {
      success: true,
      messageId:
        data?.messageId || null,
    };

  } catch (error) {
    console.error(
      "âŒ Brevo Email Error:",
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

        <h2>â™»ï¸ SWACHHLENS</h2>

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
          SWACHHLENS â€” AI Waste-Response
          Intelligence System
        </small>

      </div>
    `,
  };

  try {
    console.log(
      `ðŸ“¤ Sending OTP to: ${normalizedEmail}`
    );

    const emailResult =
  await sendViaBrevo({
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
          emailResult.messageId,

        createdAt:
          Date.now(),
      }
    );

    console.log(
      `âœ… OTP sent successfully to ${normalizedEmail}`
    );

    console.log(
      `ðŸ“¨ Message ID: ${emailResult.messageId}`
    );

    return {
      success: true,
      messageId: emailResult.messageId,
    };
  } catch (error) {

    // Do NOT keep a failed OTP
    otpStore.delete(
      normalizedEmail
    );

    console.error(
      `âŒ OTP SEND FAILED for ${normalizedEmail}`
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
      `SWACHHLENS Report Confirmation â€” ${reportId}`,
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
          â™»ï¸ SWACHHLENS
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
          âœ… Waste Report Successfully Registered
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
  ðŸ–¼ï¸ Reported Waste Image
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
          ðŸ“‹ Report Details
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
          ðŸ“ AI Analysis Summary
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
          ðŸ’¡ Recommended Action
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
          ðŸ“ Waste Location
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
            ðŸ¤ Your Information Is Our Responsibility
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
                  ðŸ”Ž Track Your Report
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
          SWACHHLENS â€” AI Waste-Response Intelligence System
        </p>

      </div>
    `,
  };

  // ===================================================
  // SEND EMAIL
  // ===================================================

  try {

    console.log(
      `ðŸ“¤ Sending waste report email to: ${normalizedEmail}`
    );

    console.log(
      `ðŸ†” Report ID: ${reportId}`
    );

   const emailResult =
  await sendViaBrevo({
    to: normalizedEmail,
    subject: mailOptions.subject,
    text: mailOptions.text,
    html: mailOptions.html,

    attachments:
      imagePath && fs.existsSync(imagePath)
        ? [
            {
              name: "reported-waste-image.jpg",
              content: fs.readFileSync(imagePath).toString("base64"),
            },
          ]
        : [],
  });

if (!emailResult.success) {
  throw new Error(
    emailResult.message ||
    "Failed to send email."
  );
}

    console.log(
      `âœ… Waste report email sent successfully to ${normalizedEmail}`
    );

    console.log(
      `ðŸ“¨ Message ID: ${emailResult.messageId}`
    );

    return {
      success: true,
      messageId:
        emailResult.messageId,
    };

  } catch (error) {

    console.error(
      `âŒ WASTE REPORT EMAIL FAILED for ${normalizedEmail}`
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
