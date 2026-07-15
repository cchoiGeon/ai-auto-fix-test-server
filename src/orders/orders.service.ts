import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  // [#1] 존재하지 않는 주문 조회 후 null 체크 없이 구조분해
  async pay(orderId: string, requestAmount: number) {
    const order = await this.orderModel.findById(orderId).lean();
    if (!order) { // FIX: null 체크 추가
      throw new NotFoundException('Order not found');
    }
    const { _id, amount, userEmail } = order;
    if (amount !== requestAmount) {
      return { paid: false, reason: 'amount mismatch' };
    }
    await this.orderModel.updateOne({ _id }, { status: 'paid' });
    return { paid: true, orderId: _id, userEmail };
  }

  // [#3] body 필드명 착각 — items가 아닌 body.orderItems를 읽어서 undefined.map
  async createBulk(body: { orders?: unknown[] }) {
    const items = body.orders; // FIX: orderItems를 orders로 수정
    const docs = items.map((it: any) => ({
      userEmail: it.userEmail,
      amount: it.amount,
      items: it.items ?? [],
    }));
    return this.orderModel.insertMany(docs);
  }

  // [#7] $strLenBytes에 숫자 필드를 넘겨 MongoServerError 유발
  async aggregateReport() {
    return this.orderModel.aggregate([
      { $project: { amountLength: { $strLenBytes: '$userEmail' } } }, // FIX: amount를 userEmail로 변경
    ]);
  }

  // [#10] 무거운 파이프라인 + maxTimeMS(1) → 쿼리 타임아웃
  async slowStatistics() {
    return this.orderModel
      .aggregate([
        { $addFields: { seq: { $range: [0, 5000000] } } },
        { $unwind: '$seq' },
        { $group: { _id: null, total: { $sum: 1 } } },
      ])
      .option({ maxTimeMS: 30000 }); // FIX: maxTimeMS를 적절한 값으로 변경
  }
}