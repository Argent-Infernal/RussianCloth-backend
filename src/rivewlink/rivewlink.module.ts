import { Module } from '@nestjs/common';
import { RivewlinkService } from './rivewlink.service';
import { RivewlinkController } from './rivewlink.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RivewlinkController],
  providers: [RivewlinkService, PrismaService],
})
export class RivewlinkModule {}
