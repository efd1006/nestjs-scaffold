import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDTO {

  @ApiProperty()
  @IsNotEmpty({message: 'Email is required.'})
  @IsEmail({}, {message: 'Email must be valid.'})
  email: string

  @ApiProperty()
  @MinLength(8, { message: 'Password must be longer than or equal to 8 characters' })
  @IsNotEmpty({message: 'Password is required.'})
  password: string

}