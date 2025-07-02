import {
  Body,
  Controller,
  HttpCode,
  Post,
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

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(signupSchema))
  @HttpCode(201)
  @SetMetadata('message', 'User signed up successfully')
  @ApiOperation({ summary: 'User Signup' })
  @ApiBody({
    description: 'JSON object containing user signup details',
  })
  @ApiResponse({
    status: 201,
    description: 'User signed up successfully',
    example: signupResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    example: signupBadRequest,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: userExists,
  })
  async signup(@Body() user: signupDto) {
    return await this.authService.signupService(user);
  }
}
