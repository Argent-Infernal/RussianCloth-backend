import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { PrismaService } from 'src/prisma.service';

dayjs.locale('ru')

const monthNames = [
    'янв',
    'фев',
    'мар',
    'апр',
    'май',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
]

@Injectable()
export class StatisticService {
    constructor(private prisma:PrismaService) {}

    async getMainStatistics() {
        const totalRevenue = await this.calculateTotalRevenue()
        const productsCount = await this.countProducts()
        
        return [
            {id: 1, name:'Выручка', value: totalRevenue},
            {id: 2, name:'Товары', value: productsCount},
        ]
    }

    async getMiddleStatistics() {
        const monthlySales = await this.calculateMonthlySales()
        const lastUsers = await this.getLastUsers()

        return {monthlySales, lastUsers}
    }

    private async calculateTotalRevenue(){
        const orders = await this.prisma.order.findMany({
            include: {
                items: true
            }
        })

        const totalRevenue = orders.reduce((acc, order)=>{
            const total = order.items.reduce((itemAcc, item)=>{
                return itemAcc + item.price * item.quantity
            }, 0)
            return acc + total
        }, 0)
        return totalRevenue
    }

    private async countProducts() {
        const productsCount = await this.prisma.product.count()

        return productsCount
    }

    private async calculateMonthlySales() {
        const startDate = dayjs().subtract(30, 'days').startOf('day').toDate()
        const endDate = dayjs().endOf('day').toDate()

        const salesRaw = await this.prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                },
            },
            include: {
                items: true
            }
        })


        const formatDate = (date: Date):string => {
            return `${date.getDate()} ${monthNames[date.getMonth()]}`
        }

        const salesByDate = new Map<string, number>()

        salesRaw.forEach(order => {
            const formattedDate = formatDate(new Date(order.createdAt))

            const total = order.items.reduce((total,item) => {
                return total + item.price * item.quantity
            }, 0)

            if (salesByDate.has(formattedDate)) {
                salesByDate.set(
                    formattedDate,
                    salesByDate.get(formattedDate)! + total
                )
            } else {
                salesByDate.set(formattedDate,total)
            }
        })

        const monthlySales = Array.from(salesByDate, ([date,value]) => ({
            date,
            value
        }))

        return monthlySales
    }

    private async getLastUsers() {
        const lastUsers = await this.prisma.user.findMany({
            orderBy: {createdAt: 'desc'},
            take: 5,
            include: {
                orders: {
                    include: {
                        items: {
                            select: {price:true}
                        }
                    }
                }
            }
        })

        return lastUsers.filter(user => user.orders.length > 0).map(user => {
            const lastOrder = user.orders[user.orders.length - 1]

            const total = lastOrder.items.reduce((total, item) => {
                return total + item.price
            }, 0)

            return {
                id: user.id,
                name: user.fullname,
                email: user.email,
                picture: user.picture,
                total
            }
        })
    }
}
