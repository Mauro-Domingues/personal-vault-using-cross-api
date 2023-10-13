import { Token } from '@modules/users/entities/Token';
import { IBaseRepositoryDTO } from '@shared/container/modules/repositories/IBaseRepository';

export interface ITokensRepositoryDTO extends IBaseRepositoryDTO<Token> {}
