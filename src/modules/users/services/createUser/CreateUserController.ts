import { IUserDTO } from '@modules/users/dtos/IUserDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IResponseDTO } from '@dtos/IResponseDTO';
import { User } from '@modules/users/entities/User';
import { CreateUserService } from './CreateUserService';

export class CreateUserController {
  public async handle(
    request: Request<never, never, IUserDTO>,
    response: Response<IResponseDTO<User>>,
  ) {
    const userData = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute(userData);

    return response.status(user.code).send(user);
  }
}
