import { ArrayMaxSize, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator";


export class UserDto {

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

    @IsNumber({},{message: 'Цена должна быть числом'})
    @IsNotEmpty({message: 'Цена не может быть пустой'})
    price: number

    @IsString({message: 'Укажите хотя бы одну картинку', each: true})
    @ArrayMaxSize(1, {message: 'Должна быть только одна картинка'})
    @IsNotEmpty({message: 'Путь к картинке не может быть пустым', each: true})
    picture: string[]
}
