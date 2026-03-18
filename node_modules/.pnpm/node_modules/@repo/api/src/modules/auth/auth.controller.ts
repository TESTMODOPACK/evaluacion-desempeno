import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  @Get('me')
  me() {
    return {
      id: 'demo-user',
      email: 'demo@empresa.com',
      name: 'Usuario Demo',
      role: 'HR_ADMIN',
    };
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken?: string }) {
    return {
      accessToken: 'demo-access-token',
      refreshToken: body?.refreshToken ?? 'demo-refresh-token',
    };
  }
}
