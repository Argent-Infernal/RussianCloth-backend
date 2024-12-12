import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReview } from './dto/CreateReview.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Auth()
    @Post(':reviewLinkId')
    async create(@CurrentUser('id') userId:string, @Param('reviewLinkId') reviewLinkId:string, @Body() createReviewDto: CreateReview) {
        return this.reviewService.createReview(userId,reviewLinkId,createReviewDto);
    }

    @Get()
    async findAll() {
        return this.reviewService.getReviews();
    }

    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Auth()
    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.reviewService.deleteReview(id);
        return { message: 'Отзыв успешно удален' };
    }
}
