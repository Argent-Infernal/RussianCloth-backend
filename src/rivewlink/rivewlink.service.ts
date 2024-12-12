import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as dayjs from 'dayjs'
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RivewlinkService {
    constructor(private prisma: PrismaService) {}

    async createReviewLink() {
        const uniqueId = randomBytes(4).toString('hex');
        const url = uniqueId;
        const expiresAt = dayjs().add(3, 'day').toDate();

        await this.prisma.reviewLinks.create({
            data: {
                url,
                expiresAt,
            },
        });

        return {url: `${process.env['CLIENT_URL']}/review/${uniqueId}`};
    }

    async markLinkAsUsed(id: string): Promise<void> {
        await this.prisma.reviewLinks.update({
            where: { id },
            data: { isUsed: true },
        });
    }

    async isLinkValid(url: string): Promise<boolean> {
        const link = await this.prisma.reviewLinks.findUnique({
            where: { url },
        });

        if (!link) {
            return false;
        }

        return !link.isUsed && dayjs().isBefore(link.expiresAt);
    }
}
