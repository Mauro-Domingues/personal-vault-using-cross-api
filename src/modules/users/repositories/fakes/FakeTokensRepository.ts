import { Token } from '@modules/users/entities/Token';
import { ITokensRepositoryDTO } from '@modules/users/repositories/ITokensRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakeTokensRepository
  extends FakeBaseRepository<Token>
  implements ITokensRepositoryDTO {}
