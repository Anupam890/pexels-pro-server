export const verificationTemplate = (token) => `
<div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f8fb; padding: 40px 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #00c6ff, #0072ff); padding: 24px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 26px; letter-spacing: 1px;">
        Pexels AI
      </h1>
      <p style="margin: 8px 0 0; color: #eaf6ff; font-size: 14px;">
        AI-powered creativity
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 32px; color: #333333;">
      <h2 style="margin-top: 0; font-size: 22px; color: #111;">
        Verify your email address
      </h2>

      <p style="font-size: 15px; line-height: 1.6; color: #555;">
        Thanks for signing up with <strong>Pexels AI</strong> 🎉  
        Use the verification code below to confirm your email address.
      </p>

      <!-- OTP Box -->
      <div style="
        margin: 30px auto;
        max-width: 300px;
        background: #f1f5ff;
        border: 2px dashed #4f7cff;
        border-radius: 10px;
        padding: 18px;
        text-align: center;
        font-size: 28px;
        letter-spacing: 6px;
        font-weight: 700;
        color: #2a4cff;">
        ${token}
      </div>

      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        This code will expire in <strong>10 minutes</strong>.  
        Please do not share this code with anyone.
      </p>

      <p style="margin-top: 24px; font-size: 14px; color: #888;">
        If you didn’t create an account with Pexels AI, you can safely ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #999;">
      © ${new Date().getFullYear()} Pexels AI. All rights reserved.
      <br />
      Built with ❤️ by Anupam Mandal.
    </div>

  </div>
</div>
`;