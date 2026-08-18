import {UserPermissions, UserRole} from '@/types/user';

export type Session = {
  id: string;
  userId: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  permissions: UserPermissions;
};
