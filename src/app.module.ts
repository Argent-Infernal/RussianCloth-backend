import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { StatisticModule } from './statistic/statistic.module';
import { ReviewModule } from './review/review.module';
import { RivewlinkModule } from './rivewlink/rivewlink.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    FileModule,
    ProductModule,
    OrderModule,
    StatisticModule,
    ReviewModule,
    RivewlinkModule
  ],
})

export class AppModule {}
