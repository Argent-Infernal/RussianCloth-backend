import { EnumOrderStatus } from "@prisma/client";
import { IsOptional, IsString } from "class-validator";

export class AdminStatusDto {
    @IsOptional()
    @IsString({message: 'Статус должен быть строкой'})
    status: EnumOrderStatus
}