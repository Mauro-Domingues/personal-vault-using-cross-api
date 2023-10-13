import { ICryptoProviderDTO } from '@shared/container/providers/CryptoProvider/models/ICryptoProvider';
import { Connection } from '@shared/typeorm';
import { JWK } from 'pem-jwk';
import { injectable, inject } from 'tsyringe';
import { Get, Route, Tags } from 'tsoa';

@Route('/generate-keys')
@injectable()
export class GenerateKeyService {
  constructor(
    @inject('CryptoProvider')
    private readonly cryptoProvider: ICryptoProviderDTO,
  ) {}

  @Get()
  @Tags('System')
  public async execute(): Promise<
    JWK<{
      use: string;
    }>
  > {
    const trx = Connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const keys = await this.cryptoProvider.generateKeys();

      if (trx.isTransactionActive) await trx.commitTransaction();
      return keys;
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
