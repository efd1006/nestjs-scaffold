import { PartialType } from "@nestjs/swagger";
import { CreateRoleDTO } from "./create-role.dto";

export class UpdateRoleDTO extends PartialType(CreateRoleDTO) {}