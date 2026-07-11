import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // [#4] GET /api/products/price?sku=NO-PRICE-001
  @Get('price')
  price(@Query('sku') sku: string) {
    return this.productsService.getDisplayPrice(sku ?? 'NO-PRICE-001');
  }

  // [#8] GET /api/products/legacy-filter
  @Get('legacy-filter')
  legacyFilter() {
    return this.productsService.findWithLegacyFilter();
  }
}
