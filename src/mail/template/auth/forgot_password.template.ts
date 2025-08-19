import { emailTemplate } from '../email.template';
import { EmailTokenProps } from '../../../shared/interfaces/auth.model';

export const forgotPasswordTemplate = ({ name, token }: EmailTokenProps) => {
  const resetUrl = `http://localhost:4200/reset-password?token=${token}`;

  const content = `
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>Hello ${name},</p>
      <p>We received a request to reset your password for your Trendloom account.</p>
      
      <p>Click the button below to reset your password:</p>

      <div style="text-align:center; margin: 20px 0;">
        <a href="${resetUrl}" style="background-color:#101720; color:#FBC500; padding:12px 24px; border-radius:5px; text-decoration:none; font-weight:bold;">
          Reset Password
        </a>
      </div>

      <p>This link will expire in <strong>3 hours</strong>. If you didn’t request a password reset, please ignore this email or contact our support team.</p>

      <div class="warning">
        ⚠️ For security, never share this email or reset link with anyone.
      </div>

      <p>Best regards,<br>The TrendLoom Team</p>
    </div>
  `;

  return emailTemplate(content);
};
