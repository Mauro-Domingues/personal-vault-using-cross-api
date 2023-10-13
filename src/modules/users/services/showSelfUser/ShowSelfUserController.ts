import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IResponseDTO } from '@dtos/IResponseDTO';
import { User } from '@modules/users/entities/User';
import { ShowSelfUserService } from './ShowSelfUserService';

export class ShowSelfUserController {
  public async handle(
    request: Request,
    response: Response<IResponseDTO<Omit<User, 'password'>>>,
  ) {
    const showSelfUser = container.resolve(ShowSelfUserService);

    const { id } = { id: request.user.id };

    const user = await showSelfUser.execute(id);

    return response.send(user);
  }
}
