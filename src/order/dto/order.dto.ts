import { EnumOrderStatus } from "@prisma/client";
import { EnumShopMethods } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, ValidateNested } from "class-validator";

export class OrderDto {
    @IsOptional()
    @IsEnum(EnumOrderStatus, {
        message: 'Статус заказа должен быть одним из ' + Object.values(EnumOrderStatus).join(', ')
    })
    status: EnumOrderStatus

    @IsArray({
        message: 'В заказе нет ни одного товара'
    })
    @ValidateNested({each: true})
    @Type(() => OrderItemDto)
    items: OrderItemDto[]

    @IsString({message: 'Адрес обязателен'})
    @IsNotEmpty({message: 'Адрес не может быть пустым'})
    address:string

    @IsString({message: 'ФИО обязательно'})
    @IsNotEmpty({message: 'ФИО не может быть пустым'})
    fullname:string

    @IsString({message: 'Страна обязательно'})
    @IsNotEmpty({message: 'Страна не может быть пустым'})
    country:string

    @IsString({message: 'Почтовый код обязателен'})
    @IsNotEmpty({message: 'Почтовый код не может быть пустым'})
    postalCode:string

    @IsString({message: 'Телефон обязательно'})
    @IsNotEmpty({message: 'Телефон не может быть пустым'})
    @IsPhoneNumber('RU',{message:'Это должен быть номер телефона'})
    phone:string

    @IsNotEmpty({message: 'Способ доставки не может быть пустым'})
    @IsEnum(EnumShopMethods, {
        message: 'Способ доставки должен быть одним из: ' + Object.values(EnumShopMethods).join(', ')
    })
    shopmethod: EnumShopMethods
}

export class OrderItemDto {
    @IsNumber({}, {message: 'Кол-во должно быть числом'})
    quantity: number 

    @IsNumber({}, {message: 'Цена должна быть числом'})
    price: number 

    @IsString({message: 'ID продукта должен быть строкой'})
    productId: string 
}