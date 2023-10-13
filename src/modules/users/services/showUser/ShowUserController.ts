import { User } from '@modules/users/entities/User';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IResponseDTO } from '@dtos/IResponseDTO';
import { IUserDTO } from '@modules/users/dtos/IUserDTO';
import { ShowUserService } from './ShowUserService';

export class ShowUserController {
  public async handle(
    request: Request<IUserDTO>,
    response: Response<IResponseDTO<User>>,
  ) {
    const showUser = container.resolve(ShowUserService);

    const { id } = request.params;

    const user = await showUser.execute(id);

    return response.status(user.code).send(user);
  }
}
