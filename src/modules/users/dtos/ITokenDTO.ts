import { Token } from '../entities/Token';

export interface ITokenDTO extends Partial<Token> {
  token: string;
  user_id: string;
}
