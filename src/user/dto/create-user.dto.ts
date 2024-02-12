import { IsString , MinLength , MaxLength , IsEmail , Matches } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    @IsString()
    @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits long' })
    phoneNumber: string;
}