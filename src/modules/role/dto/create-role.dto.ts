import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRoleDTO {
  @ApiProperty()
  @IsNotEmpty({message: 'Role name is required.'})
  @IsString()
  name: string;

  @ApiProperty({
    type: [Number]
  })
  @IsNumber({}, {each: true})
  @IsNotEmpty({message: 'Role must have atleast (1) Permission'})
  permissionIds: number[]
}