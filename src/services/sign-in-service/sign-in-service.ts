import {UserRole} from '@/types/user';

export type Input = {
  email: string;
  password: string;
  role: UserRole;
};
