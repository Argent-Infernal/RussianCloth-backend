import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, Get, Param, Put, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { OrderDto } from './dto/order.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { PaymentStatusDto } from './dto/payment-status.dto';
import { AdminStatusDto } from './dto/adminStatus.dto';
import { RolesGuard } from 'src/user/guards/roles.guard';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Auth()
    @Post('place')
    async checkout(@Body() dto: OrderDto, @CurrentUser('id') userId:string) {
        return this.orderService.createPayment(dto, userId)
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Auth()
    @Post('status')
    async updateStatus(@Body() dto: PaymentStatusDto) {
        return this.orderService.updateStatus(dto)
    }

    @UseGuards(RolesGuard)
    @Auth()
    @Get('get-all')
    async getAll() {
        return this.orderService.getAll()
    }

    @Auth()
    @Get('get-by-id/:id')
    async getOne(@Param('id') id: string) {
        return this.orderService.getById(id)
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Auth()
    @Put('status-update/:id')
    async adminUpdate(@Param('id') id: string, @Body() dto: AdminStatusDto) {
        return this.orderService.adminUpdateStatus(id, dto)
    }
}

