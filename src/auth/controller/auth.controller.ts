import {
  Body,
  Controller,
  HttpCode,
  Post,
  Query,
  SetMetadata,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { signupDto, signupSchema } from '../dto/signup.dto';
import { ZodValidationPipe } from '../../shared/pipe/zod.pipe';
import {
  verifyAccountDto,
  verifyAccountSchema,
} from '../dto/verify_account.dto';
import { successMessages } from 'src/shared/utils/constants';
import { AuthRoutes } from 'src/shared/utils/routes';
import { signinDto, signinSchema } from '../dto/signin.dto';
import { DataMessageInterceptor } from '../../shared/interceptors/data-message.interceptor';
import { MessageInterceptor } from '../../shared/interceptors/message.interceptor';
import {
  signupBadRequest,
  signupBadRequestDescription,
  signupBodyDescription,
  signupConflictDescription,
  signupResponse,
  signupSummary,
  SignupSwaggerDto,
  userExists,
} from '../../shared/swagger/auth/signup.swagger';
import {
  tokenParam,
  verificationBadRequestDescription,
  verificationSummary,
  VerificationSwaggerDto,
  verifyAccountBadRequest,
  verifyAccountBodyDescription,
  verifyAccountResponse,
} from '../../shared/swagger/auth/verify_account.swagger';
import {
  signinBadRequest,
  signinBadRequestDescription,
  signinBodyDescription,
  signinResponse,
  signinSummary,
  SigninSwaggerDto,
} from '../../shared/swagger/auth/signin.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(AuthRoutes.signup)
  @UsePipes(new ZodValidationPipe(signupSchema))
  @HttpCode(201)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', successMessages.signup)
  @ApiOperation({ summary: signupSummary })
  @ApiBody({
    description: signupBodyDescription,
    type: SignupSwaggerDto,
  })
  @ApiResponse({
    status: 201,
    description: successMessages.signup,
    example: signupResponse,
  })
  @ApiResponse({
    status: 400,
    description: signupBadRequestDescription,
    example: signupBadRequest,
  })
  @ApiResponse({
    status: 409,
    description: signupConflictDescription,
    example: userExists,
  })
  async signup(@Body() user: signupDto) {
    return await this.authService.signupService(user);
  }

  @Post(AuthRoutes.verifyAccount)
  @HttpCode(200)
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', successMessages.accountVerified)
  @ApiOperation({ summary: verificationSummary })
  @ApiParam({
    name: 'token',
    description: tokenParam,
    required: true,
  })
  @ApiBody({
    description: verifyAccountBodyDescription,
    type: VerificationSwaggerDto,
  })
  @ApiResponse({
    status: 200,
    description: successMessages.accountVerified,
    example: verifyAccountResponse,
  })
  @ApiResponse({
    status: 400,
    description: verificationBadRequestDescription,
    example: verifyAccountBadRequest,
  })
  async verify(
    @Query('token') token: string,
    @Body(new ZodValidationPipe(verifyAccountSchema)) code: verifyAccountDto,
  ) {
    return this.authService.verifyAccount(code, token);
  }

  @Post(AuthRoutes.signin)
  @UsePipes(new ZodValidationPipe(signinSchema))
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', successMessages.signin)
  @ApiOperation({ summary: signinSummary })
  @ApiBody({
    description: signinBodyDescription,
    type: SigninSwaggerDto,
  })
  @ApiResponse({
    status: 200,
    description: successMessages.signin,
    example: signinResponse,
  })
  @ApiResponse({
    status: 400,
    description: signinBadRequestDescription,
    example: signinBadRequest,
  })
  async signin(@Body() user: signinDto) {
    return await this.authService.signinService(user);
  }
}
