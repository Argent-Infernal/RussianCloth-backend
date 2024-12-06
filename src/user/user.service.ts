import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {hash} from 'argon2';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async getAll(){
        const users = await this.prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                orders: true,
                reviews: true,
            }
        })

        return users
    }

    async getById(id:string){
        const user = await this.prisma.user.findUnique({
            where: {
                id
            },
            include:{
                orders: true
            }
        })

        return user
    }

    async getByEmail(email:string){
        const user = await this.prisma.user.findUnique({
            where: {
                email
            },
            include:{
                orders: true
            }
        })

        return user
    }

    async checkIsAdmin(id:string){
        const user = await this.getById(id)

        return user.role === 'admin' ? true : false
    }

    async create(dto: AuthDto) {
        return this.prisma.user.create({
            data: {
                email: dto.email,
                password: await hash(dto.password)
            }
        })
    }

    async changeUserRole(userId: string, newRole: string): Promise<User> {

        if (newRole !== 'admin' && newRole !== 'user') {
            throw new BadRequestException('Допустимые роли: admin, user');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        });
    }
}
