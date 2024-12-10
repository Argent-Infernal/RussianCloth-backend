import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { YooCheckout} from '@a2seven/yoo-checkout'
import { OrderDto } from './dto/order.dto';
import { PaymentStatusDto } from './dto/payment-status.dto';
import { EnumOrderStatus, EnumShopMethods } from '@prisma/client';
import { AdminStatusDto } from './dto/adminStatus.dto';

const checkout = new YooCheckout({
    shopId: process.env['YOOKASSA_SHOP_ID'],
    secretKey: process.env['YOOKASSA_SECRET_KEY']
})

const shippingPrices = {
    [EnumShopMethods.CDEK]: 500,
    [EnumShopMethods.RUSSIAMAIL]: 300
};

const enumsStatus = {
    ['Pending']: EnumOrderStatus.PENDING,
    ['Payed']: EnumOrderStatus.PAYED,
    ['Sent']: EnumOrderStatus.SENT,
    ['Cancelled']: EnumOrderStatus.CANCELLED,
    ['Accepted']: EnumOrderStatus.ACCEPTED,
    ['Done']: EnumOrderStatus.DONE
}

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    async getAll() {
        const orders = await this.prisma.order.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                items: true,
                user: true
            }
        })

        return orders
    }

    async getById(id:string) {
        const order = await this.prisma.order.findUnique({
            where: {
                id
            },
            include: {
                items: true,
                user: true
            }
        })
        return order
    }

    async createPayment(dto:OrderDto, userId:string) {
        const orderItems = dto.items.map(item => ({
            quantity: item.quantity,
            price: item.price,
            product: {
                connect: {
                    id: item.productId
                }
            }
        }))

        const total = dto.items.reduce((acc, item) => {
            return acc + item.price * item.quantity
        }, 0) + shippingPrices[dto.shopmethod]

        const order = await this.prisma.order.create({
            data: {
                status: dto.status,
                items: {
                    create: orderItems
                },
                total: total,
                user: {
                    connect: {
                        id: userId
                    }
                },
                address: dto.address,
                fullname: dto.fullname,
                country: dto.country,
                postalCode: dto.postalCode,
                phone: dto.phone,
                shopmethod: dto.shopmethod
            }
        })

        const payment = await checkout.createPayment({
            amount: {
                value: total.toFixed(2),
                currency: 'RUB'
            },
            payment_method_data: {
                type: 'bank_card'
            },
            confirmation: {
                type: 'redirect',
                return_url: `${process.env.CLIENT_URL}/dashboard/orders`
            },
            description: `Оплата заказа в магазине RussianCloth. ID платежа: #${order.id}`
        })

        return payment
    }

    async adminUpdateStatus(id:string,dto: AdminStatusDto) {
        if (!enumsStatus[dto.status])
            throw new NotFoundException('Такой статус не найден')

        const order = await this.prisma.order.update({
            where: {
                id
            },
            data: {
                status: enumsStatus[dto.status]
            }
        })
        
        return order
    }
    
    async updateStatus(dto:PaymentStatusDto) {
        if (dto.event === 'payment.waiting_for_capture') {
            // const capturePayment: ICapturePayment = {
            //     amount: {
            //         value: dto.object.amount.value,
            //         currency: dto.object.amount.currency
            //     }
            // }

            // return checkout.cancelPayment(dto.object.id, capturePayment)
            return checkout.cancelPayment(dto.object.id)
        }

        if (dto.event === 'payment.succeeded') {
            const orderId = dto.object.description.split('#')[1]

            await this.prisma.order.update({
                where: {
                    id: orderId
                },
                data: {
                    status: EnumOrderStatus.PAYED
                }
            })

            return true
        }
        return true
    }

}
