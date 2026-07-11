import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'orders', timestamps: true })
export class Order {
  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ type: [{ sku: String, qty: Number, price: Number }], default: [] })
  items: { sku: string; qty: number; price: number }[];
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
