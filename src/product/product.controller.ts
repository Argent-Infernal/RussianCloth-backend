import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, HttpCode, Put, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';
import { RolesGuard } from 'src/user/guards/roles.guard';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    async getAll() {
        return this.productService.getAll()
    }

    @Get('by-id/:id')
    async getById(@Param('id') id:string) {
        return this.productService.getById(id)
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Auth()
    @Post()
    async create(@Body() dto:ProductDto) {
        return this.productService.create(dto)
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Auth()
    @Put(':id')
    async update(@Param('id') id:string, @Body() dto:ProductDto) {
        return this.productService.update(id,dto)
    }

    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Auth()
    @Delete(':id')
    async delete(@Param('id') id:string) {
        return this.productService.delete(id)
    }
}
