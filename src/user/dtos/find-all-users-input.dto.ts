import { UserRoles } from 'src/common/catalogs/user-role.enum';
import { UserStatus } from 'src/common/catalogs/user-status.enum';
import { FindManyOptions, FindOptionsOrder } from 'typeorm';
import { User } from '../entities/user.entity';

export class FindAllUsersFiteringInput {
  id?: number;

  username?: string;

  email?: string;

  status?: UserStatus;

  role?: UserRoles;

  createdAt?: Date;

  updatedAt?: Date;

  createdBy?: string;

  updatedBy?: string;
}

export class FindAllUsersPagingInput {
  skip?: number;

  take?: number;
}

export class FindAllUsersSortingInput {
  order: FindAllUsersFiteringInput;

  directions: 'ASC' | 'DESC';
}

export class FindAllUsersInput {
  filtering?: FindAllUsersFiteringInput;

  paging?: FindAllUsersPagingInput;

  sorting?: FindOptionsOrder<User>;
}
