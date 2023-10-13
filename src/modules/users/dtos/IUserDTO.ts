import { User } from '../entities/User';

export interface IUserDTO extends Partial<User> {
  email: string;
  password: string;
}
