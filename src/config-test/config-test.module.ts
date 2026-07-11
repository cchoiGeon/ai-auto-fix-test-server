import { Module } from '@nestjs/common';
import { ConfigTestController } from './config-test.controller';
import { ConfigTestService } from './config-test.service';

@Module({
  controllers: [ConfigTestController],
  providers: [ConfigTestService],
})
export class ConfigTestModule {}
