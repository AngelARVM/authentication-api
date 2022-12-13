import { UserRoles } from '../catalogs/user-role.enum';
import { UserStatus } from '../catalogs/user-status.enum';

export const filterCreator = (item, op) => {
  const b = {};
  item &&
    Object.entries(item).forEach((field) => {
      switch (field[0]) {
        case 'status':
          if (`${field[1]}` in UserStatus) {
            b[field[0]] = UserStatus[`${field[1]}`.toUpperCase()];
          }
          break;
        case 'role':
          if (`${field[1]}` in UserRoles) {
            b[field[0]] = UserRoles[`${field[1]}`.toUpperCase()];
          }
          break;
        case 'createdAt':
        case 'updatedAt':
        case 'deletedAt':
          b[field[0]] = new Date(`${field[1]}`);
          break;
        default:
          b[field[0]] = {
            [op]: field[1],
          };
      }
    });
  return b;
};
