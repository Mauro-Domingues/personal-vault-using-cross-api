import { User } from '@modules/users/entities/User';
import { IBaseRepositoryDTO } from '@shared/container/modules/repositories/IBaseRepository';

export interface IUsersRepositoryDTO extends IBaseRepositoryDTO<User> {}
