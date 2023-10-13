import { Token } from '@modules/users/entities/Token';
import { ITokensRepositoryDTO } from '@modules/users/repositories/ITokensRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class TokensRepository
  extends BaseRepository<Token>
  implements ITokensRepositoryDTO
{
  constructor() {
    super(Token);
  }
}
