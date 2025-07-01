import {
  Body,
  Controller,
  Post,
  SetMetadata,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../shared/interceptor/transform.interceptor';
import { AuthService } from '../service/auth.service';
import { signupDto, signupSchema } from '../dto/signup.dto';
import { ZodValidationPipe } from '../../shared/pipe/zod.pipe';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(signupSchema))
  @SetMetadata('message', 'User signed up successfully')
  @ApiOperation({ summary: 'User Signup' })
  @ApiBody({
    description: 'JSON object containing user signup details',
  })
  @ApiResponse({
    status: 201,
    description: 'User signed up successfully',
    example: 'Created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    example: 'BadRequestExample',
  })
  async signup(@Body() user: signupDto) {
    return await this.authService.signupService(user);
  }
}
