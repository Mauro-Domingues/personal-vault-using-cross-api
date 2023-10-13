import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { JWK } from 'pem-jwk';
import { GenerateKeyService } from './GenerateKeyService';

export class GenerateKeyControllerController {
  public async handle(
    _request: Request,
    response: Response<
      JWK<{
        use: string;
      }>
    >,
  ) {
    const generateKeyController = container.resolve(GenerateKeyService);

    const categorySynchronization = await generateKeyController.execute();

    return response.send(categorySynchronization);
  }
}
