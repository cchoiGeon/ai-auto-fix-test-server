import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { ExternalModule } from './external/external.module';
import { ReportsModule } from './reports/reports.module';
import { SearchModule } from './search/search.module';
import { ConfigTestModule } from './config-test/config-test.module';
import { FilesModule } from './files/files.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/spincell-test',
      {
        // 부팅 시 DB 연결을 기다리지 않음 (연결은 백그라운드에서 수립)
        lazyConnection: true,
        serverSelectionTimeoutMS: 5000,
      },
    ),
    UsersModule,
    OrdersModule,
    ProductsModule,
    PaymentsModule,
    AuthModule,
    ExternalModule,
    ReportsModule,
    SearchModule,
    ConfigTestModule,
    FilesModule,
    DatabaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
