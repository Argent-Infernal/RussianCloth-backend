import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
    @IsString({
        message: 'Почта обязательна'
    })
    @IsEmail()
    email: string

    @MinLength(6, {
        message: 'Пароль должен содержать не менее 6 символов!'
    })
    @IsString({
        message: 'Пароль обязателен'
    })
    password: string
}
