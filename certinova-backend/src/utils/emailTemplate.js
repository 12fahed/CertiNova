export const generateCertificateEmailHtml = (
  recipientName,
  eventName,
  organisationName,
  verificationUrl
) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Certificate</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
      color: #374151;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 30px 40px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 40px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 20px;
    }
    .details {
      margin: 20px 0;
      padding: 20px;
      background-color: #f3f4f6;
      border-radius: 6px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 16px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px 40px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Certificate is Here!</h1>
    </div>
    <div class="content">
      <div class="greeting">Hi ${recipientName},</div>
      <p>Congratulations! Your certificate for <strong>${eventName}</strong> has been issued by <strong>${organisationName}</strong>.</p>
      
      <p>We've attached your certificate to this email as a high-quality PNG image. You can download it and share it with your network.</p>

      ${
        verificationUrl
          ? `
      <div class="button-container">
        <a href="${verificationUrl}" class="button" style="color: white;">Verify Certificate</a>
      </div>
      <p style="font-size: 14px; color: #6b7280; text-align: center;">
        Or verify using this link:<br>
        <a href="${verificationUrl}">${verificationUrl}</a>
      </p>
      `
          : ''
      }
    </div>
    <div class="footer">
      <p>Powered by CertiNova</p>
      <p>&copy; ${new Date().getFullYear()} CertiNova. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};
