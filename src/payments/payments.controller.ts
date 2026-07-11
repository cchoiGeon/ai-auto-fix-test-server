import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // [#12] POST /api/payments  body: {} (빈 객체)
  @Post()
  record(@Body() body: Record<string, unknown>) {
    return this.paymentsService.record(body ?? {});
  }
}
