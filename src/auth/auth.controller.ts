import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // [#5] POST /api/auth/login  body: {"method":"kakao"}  (미등록 method)
  @Post('login')
  login(@Body() body: { method?: string }) {
    return this.authService.login(body ?? {});
  }
}
