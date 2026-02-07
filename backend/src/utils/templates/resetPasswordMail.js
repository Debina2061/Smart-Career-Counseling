export const resetPasswordEmail = (email, resetLink) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body{
          padding: 0;
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          color: #333;
        }
        .email-container{
          max-width: 600px;
          margin: 40px auto;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header{
          background-color: #2563eb;
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content{
          padding: 40px 30px;
        }
        .reset-button{
          display: inline-block;
          background-color: #2563eb;
          color: white;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer{
          background-color: #f8f8f8;
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid #eee;
        }
        .security-notice{
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Password Reset</h1>
        </div>
        <div class="content">
          <h2>Hello ${email},</h2>
          <p>We received a request to reset your password. Click the button below to continue.</p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="reset-button">Reset Password</a>
          </div>
          <div class="security-notice">
            <p><strong>Security Notice:</strong> This link expires in 5 minutes. If you didn't request this, ignore this email.</p>
          </div>
        </div>
        <div class="footer">
          <p>© 2025 ATS Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
