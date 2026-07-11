import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './payment.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  // [#12] 필수 필드 검증 없이 create → Mongoose ValidationError
  async record(body: Record<string, unknown>) {
    // 요청 body를 그대로 저장 (검증은 스키마가 해주겠지... 라는 흔한 실수)
    return this.paymentModel.create(body);
  }
}
