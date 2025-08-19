import { emailTemplate } from '../email.template';
import { VerifyEmailProps } from '../../../shared/interfaces/auth.model';

export const verifyEmailTemplate = ({
  code,
  expirationTime = '30 minutes',
}: VerifyEmailProps) => {
  const content = `
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Hello,</p>
      <p>Thank you for signing up with NLE LUX. To complete your registration, please use the verification code below:</p>
      
      <div class="verification-code">
        ${code}
      </div>
      
      <p>This verification code will expire in <strong>${expirationTime}</strong>.</p>
      
      <div class="warning">
        ⚠️ Never share this code with anyone. Our team will never ask for your verification code.
      </div>
      
      <p>If you didn't request this verification code, please ignore this email or contact our support team if you have concerns.</p>
      
      <p>Best regards,<br>The NLE LUX Team</p>
    </div>
  `;

  return emailTemplate(content);
};
