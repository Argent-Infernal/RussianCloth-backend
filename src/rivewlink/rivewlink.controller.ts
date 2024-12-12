import { Controller, Post, UseGuards } from '@nestjs/common';
import { RivewlinkService } from './rivewlink.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesGuard } from 'src/user/guards/roles.guard';

@Controller('rivewlinks')
export class RivewlinkController {
    constructor(private readonly rivewlinkService: RivewlinkService) {}

    @UseGuards(RolesGuard)
    @Auth()
    @Post()
    async create() {
        return this.rivewlinkService.createReviewLink();
    }

    // @Auth()
    // @Post('review/:id')
    // async submitReview(@Param('id') id: string) {
    //     const isValid = await this.rivewlinkService.isLinkValid(id);
        
    //     if (!isValid) {
    //         throw new Error('Ссылка недействительна или уже использована');
    //     }

    //     await this.rivewlinkService.markLinkAsUsed(id);

    //     return { message: 'Отзыв успешно оставлен' };
    // }
}
