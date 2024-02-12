import { IsOptional , IsString , MinLength , MaxLength , IsEmail , Matches } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username?: string;
  
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password?: string;
  
    @IsOptional()
    @IsString()
    @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits long' })
    phoneNumber?: string;
}