import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReview } from './dto/CreateReview.dto';
import { RivewlinkService } from 'src/rivewlink/rivewlink.service';

@Injectable()
export class ReviewService {
    constructor(
        private prisma: PrismaService,
        private reviewLinksService: RivewlinkService
    ) {}

    async createReview(userId:string, reviewLinkId:string, createReviewDto: CreateReview): Promise<any> {
        const { text, rating } = createReviewDto;

        const isValidLink = await this.reviewLinksService.isLinkValid(reviewLinkId);
        if (!isValidLink) {
            throw new ForbiddenException('Недействительная ссылка для отзыва');
        }

        return await this.prisma.review.create({
            data: {
                text,
                rating,
                user: { connect: { id: userId } },
            },
        });
    }
    
    async getReviews(): Promise<any[]> {
        return await this.prisma.review.findMany({
            include: {
                user: true,
            },
        });
    }
    
    async deleteReview(id: string): Promise<void> {
        const review = await this.prisma.review.findUnique({
            where: { id },
        });
    
        if (!review) {
            throw new NotFoundException('Отзыв не найден');
        }
    
        await this.prisma.review.delete({
            where: { id },
        });
    }
}
