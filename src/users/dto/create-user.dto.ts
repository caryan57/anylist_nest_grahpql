import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { BeforeInsert, BeforeUpdate } from "typeorm";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  fullname: string;
  
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contrasena debe ser de al menos 8 caracteres y una letra mayuscula, una minuscula y un numero'
  })
  password: string;
  
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
