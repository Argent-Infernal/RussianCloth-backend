import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateReview {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsInt()
    @IsNotEmpty()
    rating: number;
}