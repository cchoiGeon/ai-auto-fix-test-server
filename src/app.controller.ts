import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // 정상 동작 확인용 (200)
  @Get('health')
  health() {
    return { status: 'ok', ts: new Date().toISOString() };
  }
}
