import { IAuthDTO } from '@modules/users/dtos/IAuthDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IResponseDTO } from '@dtos/IResponseDTO';
import { AuthenticateUserService } from './AuthenticateUserService';

export class AuthenticateUserController {
  public async handle(
    request: Request<never, never, IAuthDTO>,
    response: Response<
      IResponseDTO<{
        jwt_token: string;
        refresh_token?: string | undefined;
      }>
    >,
  ) {
    const userData = request.body;
    userData.ip = request.ip;

    const authenticateUsers = container.resolve(AuthenticateUserService);

    const user = await authenticateUsers.execute(userData);

    return response.send(user);
  }
}
