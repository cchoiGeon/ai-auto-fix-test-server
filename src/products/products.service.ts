import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  // [#4] price가 없는 상품에 toFixed 호출
  async getDisplayPrice(sku: string) {
    const product = await this.productModel.findOne({ sku }).lean();
    return {
      sku: product.sku,
      name: product.name,
      displayPrice: `${product.price.toFixed(0)}원`,
    };
  }

  // [#8] 알 수 없는 top-level 연산자 → MongoServerError
  async findWithLegacyFilter() {
    return this.productModel.collection.findOne({
      $priceBetween: [1000, 5000],
    } as any);
  }
}
