import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExternalService } from './external.service';

@Controller('external')
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {}

  // [#13] GET /api/external/inventory-sync
  @Get('inventory-sync')
  inventorySync() {
    return this.externalService.syncInventory();
  }

  // [#14] POST /api/external/charge  body: {"amount": 5000}
  @Post('charge')
  charge(@Body() body: { amount?: number }) {
    return this.externalService.chargeViaGateway(body?.amount ?? 0);
  }

  // [#15] GET /api/external/exchange-rate
  @Get('exchange-rate')
  exchangeRate() {
    return this.externalService.fetchExchangeRate();
  }

  // [#16] GET /api/external/partner-catalog
  @Get('partner-catalog')
  partnerCatalog() {
    return this.externalService.importPartnerCatalog();
  }
}
