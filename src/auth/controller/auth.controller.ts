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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../shared/interceptor/response.interceptor';
import { AuthService } from '../service/auth.service';
import { signupDto, signupSchema } from '../dto/signup.dto';
import { ZodValidationPipe } from '../../shared/pipe/zod.pipe';
import {
  signupBadRequest,
  signupResponse,
  userExists,
} from '../../shared/utils/swagger.utils';
import {
  verifyAccountDto,
  verifyAccountSchema,
} from '../dto/verify_account.dto';
import {
  responseDescription,
  successMessages,
} from 'src/shared/utils/constants';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(signupSchema))
  @HttpCode(201)
  @SetMetadata('message', successMessages.signup)
  @ApiOperation({ summary: 'User Signup' })
  @ApiBody({
    description: 'JSON object containing user signup details',
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

  @Post('verify-account')
  @UsePipes(new ZodValidationPipe(verifyAccountSchema))
  @HttpCode(200)
  @SetMetadata('message', 'Account verified successfully')
  @ApiOperation({ summary: 'Verify account using code and token' })
  @ApiBody({ description: "Two factor auth code to verify user's account" })
  @ApiResponse({})
  async verify(@Query('token') token: string, @Body() code: verifyAccountDto) {
    return this.authService.verifyAccount(code, token);
  }
}
