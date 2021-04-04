import { ApiProperty } from "@nestjs/swagger";
import { Allow } from "class-validator";

export class LoginDTO {

  @ApiProperty()
  @Allow()
  email: string

  @ApiProperty()
  @Allow() 
  password: string

}