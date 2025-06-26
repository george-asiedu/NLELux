import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { verifyEmailTemplate } from '../template/verify_email.template';
import { emailMessages } from '../../shared/constants';

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
    } catch (error) {
      this.logger.error(
        `${emailMessages.failedVerificationMail} ${email}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }
}
