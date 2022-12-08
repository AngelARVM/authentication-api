import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRoles } from 'src/common/catalogs/user-role.enum';
import { UserStatus } from 'src/common/catalogs/user-status.enum';

export class CreateOneUserInputDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus

  @IsString()
  @IsOptional()
  @IsEnum(UserRoles)
  role: UserRoles
}
