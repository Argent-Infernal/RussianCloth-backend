import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesGuard } from 'src/user/guards/roles.guard';

@Controller('statistics')
export class StatisticController {
    constructor(private readonly statisticService: StatisticService) {}

    @UseGuards(RolesGuard)
    @Auth()
    @Get('main')
    async getMainStatistics() {
        return this.statisticService.getMainStatistics()
    }

    @UseGuards(RolesGuard)
    @Auth()
    @Get('middle')
    async getMiddleStatistics() {
        return this.statisticService.getMiddleStatistics()
    }
}
