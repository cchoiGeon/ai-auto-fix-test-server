import { Controller, Get } from '@nestjs/common';
import { ConfigTestService } from './config-test.service';

@Controller('config')
export class ConfigTestController {
  constructor(private readonly configTestService: ConfigTestService) {}

  // [#25] GET /api/config/gateway-key
  @Get('gateway-key')
  gatewayKey() {
    return this.configTestService.getGatewayKeyPreview();
  }

  // [#26] GET /api/config/cache-buckets
  @Get('cache-buckets')
  cacheBuckets() {
    return this.configTestService.initCacheBuckets();
  }

  // [#27] GET /api/config/apm
  @Get('apm')
  apm() {
    return this.configTestService.loadApmAgent();
  }
}
