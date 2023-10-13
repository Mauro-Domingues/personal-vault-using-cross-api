import { SignOptions } from 'jsonwebtoken';
import { JWK } from 'pem-jwk';
import { ICryptoDTO } from '../dtos/ICryptoDTO';

export interface ICryptoProviderDTO {
  encrypt(text: string): Promise<ICryptoDTO>;
  decrypt(hash: ICryptoDTO): Promise<string>;
  generateKeys(): Promise<
    JWK<{
      use: string;
    }>
  >;
  generateJwt(
    payload: object,
    ip: string,
    options?: SignOptions,
  ): Promise<{
    jwt_token: string;
    refresh_token: string;
  }>;
}
