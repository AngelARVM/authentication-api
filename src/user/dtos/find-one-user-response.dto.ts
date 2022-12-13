import { UserRoles } from 'src/common/catalogs/user-role.enum';
import { UserStatus } from 'src/common/catalogs/user-status.enum';

export class FindOneUserResponse {
  id: number;

  username: string;

  email: string;

  status?: UserStatus;

  role?: UserRoles;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;

  createdBy?: string;

  updatedBy?: string;

  deletedBy?: string;
}
