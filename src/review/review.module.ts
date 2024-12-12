import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from 'src/prisma.service';
import { RivewlinkService } from 'src/rivewlink/rivewlink.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService, RivewlinkService],
})
export class ReviewModule {}
