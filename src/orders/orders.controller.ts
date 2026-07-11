import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // [#1] POST /api/orders/64f000000000000000000000/pay  body: {"amount": 1000}
  @Post(':id/pay')
  pay(@Param('id') id: string, @Body() body: { amount: number }) {
    return this.ordersService.pay(id, body?.amount ?? 0);
  }

  // [#3] POST /api/orders/bulk  body: {"orders":[{"userEmail":"a@b.c","amount":100}]}
  @Post('bulk')
  bulk(@Body() body: { orders?: unknown[] }) {
    return this.ordersService.createBulk(body ?? {});
  }

  // [#7] GET /api/orders/report/aggregate
  @Get('report/aggregate')
  aggregate() {
    return this.ordersService.aggregateReport();
  }

  // [#10] GET /api/orders/report/slow
  @Get('report/slow')
  slow() {
    return this.ordersService.slowStatistics();
  }
}
