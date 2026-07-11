import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'payments', timestamps: true })
export class Payment {
  @Prop({ required: true, type: Types.ObjectId })
  orderId: Types.ObjectId;

  @Prop({ required: true, min: 100 })
  amount: number;

  @Prop({ required: true, enum: ['card', 'bank', 'point'] })
  method: string;
}

export type PaymentDocument = HydratedDocument<Payment>;
export const PaymentSchema = SchemaFactory.createForClass(Payment);
