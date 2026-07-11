import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  // [#9] GET /api/database/legacy-replica
  @Get('legacy-replica')
  legacyReplica() {
    return this.databaseService.checkLegacyReplica();
  }
}
