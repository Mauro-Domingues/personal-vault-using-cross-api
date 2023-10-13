import { User } from '@modules/users/entities/User';
import { IUsersRepositoryDTO } from '@modules/users/repositories/IUsersRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakeUsersRepository
  extends FakeBaseRepository<User>
  implements IUsersRepositoryDTO {}
