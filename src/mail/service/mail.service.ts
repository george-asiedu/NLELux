import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { verifyEmailTemplate } from '../template/auth/verify_email.template';
import { emailMessages } from '../../shared/utils/constants';
import { forgotPasswordTemplate } from '../template/auth/forgot_password.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendAccountVerificationEmail(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: emailMessages.verifyAccount,
        html: verifyEmailTemplate({ code }),
      });
      this.logger.log(`${emailMessages.verificationMailSent} ${email}`);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `${emailMessages.failedVerificationMail} ${email}: ${err.message}`,
        err.stack,
      );
      return false;
    }
  }

  async sendForgotPasswordEmail(email: string, token: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: emailMessages.forgotPassword,
        html: forgotPasswordTemplate({ name, token }),
      });
      this.logger.log(`${emailMessages.mailSent} ${email}`);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `${emailMessages.failedSendingMail} ${email}: ${err.message}`,
        err.stack,
      );
      return false;
    }
  }
}
