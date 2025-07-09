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
import { ResponseInterceptor } from '../../shared/interceptor/response.interceptor';
import { AuthService } from '../service/auth.service';
import { signupDto, signupSchema } from '../dto/signup.dto';
import { ZodValidationPipe } from '../../shared/pipe/zod.pipe';
import {
  signupBadRequest,
  signupResponse,
  SignupSwaggerDto,
  userExists,
  verifyAccountBadRequest,
  verifyAccountResponse,
  VerifyAccountSwaggerDto,
  signinResponse,
  signinBadRequest,
  SigninSwaggerDto,
  bodyDescription,
  summary,
  responseDescription,
} from '../../shared/utils/swagger.utils';
import {
  verifyAccountDto,
  verifyAccountSchema,
} from '../dto/verify_account.dto';
import { successMessages } from 'src/shared/utils/constants';
import { AuthRoutes } from 'src/shared/utils/routes';
import { signinDto, signinSchema } from '../dto/signin.dto';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(AuthRoutes.signup)
  @UsePipes(new ZodValidationPipe(signupSchema))
  @HttpCode(201)
  @SetMetadata('message', successMessages.signup)
  @ApiOperation({ summary: summary.signup })
  @ApiBody({
    type: SignupSwaggerDto,
    description: bodyDescription.signup,
  })
  @ApiResponse({
    status: 201,
    description: successMessages.signup,
    example: signupResponse,
  })
  @ApiResponse({
    status: 400,
    description: responseDescription.badRequest,
    example: signupBadRequest,
  })
  @ApiResponse({
    status: 409,
    description: responseDescription.conflict,
    example: userExists,
  })
  async signup(@Body() user: signupDto) {
    return await this.authService.signupService(user);
  }

  @Post(AuthRoutes.verifyAccount)
  @HttpCode(200)
  @SetMetadata('message', successMessages.accountVerified)
  @ApiOperation({ summary: summary.verifyAccount })
  @ApiParam({
    name: 'token',
    description: bodyDescription.tokenParam,
    required: true,
  })
  @ApiBody({
    description: bodyDescription.verifyAccount,
    type: VerifyAccountSwaggerDto,
  })
  @ApiResponse({
    status: 200,
    description: successMessages.accountVerified,
    example: verifyAccountResponse,
  })
  @ApiResponse({
    status: 400,
    description: responseDescription.badRequest,
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
  @SetMetadata('message', successMessages.login)
  @ApiOperation({ summary: summary.signin })
  @ApiBody({
    type: SigninSwaggerDto,
    description: bodyDescription.signin,
  })
  @ApiResponse({
    status: 200,
    description: successMessages.login,
    example: signinResponse,
  })
  @ApiResponse({
    status: 400,
    description: responseDescription.badRequest,
    example: signinBadRequest,
  })
  async signin(@Body() user: signinDto) {
    return await this.authService.signinService(user);
  }
}
