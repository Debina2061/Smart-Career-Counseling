export const verifyEmail = (email,verificationLink)=>{
    return (
        `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - ATS Platform</title>
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
            background-color: #4CAF50;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1{
            margin: 0;
            font-size: 28px;
        }
        .content{
            padding: 40px 30px;
        }
        .content h2{
            color: #333;
            margin-bottom: 20px;
        }
        .content p{
            line-height: 1.6;
            margin-bottom: 20px;
            color: #666;
        }
        .verify-button{
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
        }
        .verify-button:hover{
            background-color: #45a049;
        }
        .footer{
            background-color: #f8f8f8;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #eee;
        }
        .footer p{
            margin: 0;
            color: #999;
            font-size: 14px;
        }

        .security-notice{
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .security-notice p{
            margin: 0;
            color: #856404;
            font-size: 14px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="header">
            <h1>Email Verification Required</h1>
        </div>

        <!-- Main Content -->
        <div class="content">
            <h2>Hello ${email},</h2>
            
            <p>Thank you for registering with our ATS (Application Tracking System). To complete your registration and secure your account, please verify your email address.</p>
            
            <p>Click the button below to verify your email address:</p>
            
            <!-- Verification Button -->
            <div style="text-align: center;">
                <a href="${verificationLink}" class="verify-button">Verify Email Address</a>
            </div>
            
            <!-- Security Notice -->
            <div class="security-notice">
                <p><strong>Security Notice:</strong> This verification link will expire in 5 minutes. If you didn't create an account with us, please ignore this email.</p>
            </div>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        </div>

        <!-- Footer Section -->
        <div class="footer">
            <p>© 2025 ATS Platform. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>

</html>
        `
    )
}
