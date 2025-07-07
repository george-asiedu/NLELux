export const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NLE LUX</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: "Roboto Flex", sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      background: #2C3E50;
      padding: 20px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .header img {
      max-width: 150px;
      height: auto;
    }
    .content {
      padding: 30px;
      color: #333333;
    }
    .verification-code {
      background: #f8f9fa;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
      text-align: center;
      font-size: 24px;
      letter-spacing: 5px;
      font-weight: bold;
      color: #2C3E50;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666666;
      font-size: 12px;
      background: #f8f9fa;
      border-radius: 0 0 10px 10px;
    }
    .warning {
      color: #856404;
      background-color: #fff3cd;
      border: 1px solid #ffeeba;
      padding: 10px;
      border-radius: 5px;
      font-size: 14px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://res.cloudinary.com/dhyqv69zh/image/upload/nle_logo_focipq.png" alt="NLE Lux Logo">
    </div>
    ${content}
    <div class="footer">
      <p>© ${new Date().getFullYear()} NLE LUX. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
      <p>
        <a href="#privacy">Privacy Policy</a> | 
        <a href="#terms">Terms of Service</a> | 
        <a href="#contact">Contact Us</a>
      </p>
    </div>
  </div>
</body>
</html>
`;
