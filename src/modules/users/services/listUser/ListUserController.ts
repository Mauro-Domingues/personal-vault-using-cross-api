import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindOptionsWhere } from 'typeorm';
import { User } from '@modules/users/entities/User';
import { IListDTO } from '@dtos/IListDTO';
import { ListUserService } from './ListUserService';

export class ListUserController {
  public async handle(
    request: Request<
      never,
      never,
      never,
      { page: number; limit: number } & FindOptionsWhere<User>
    >,
    response: Response<IListDTO<User>>,
  ) {
    const listUser = container.resolve(ListUserService);

    const { page = 1, limit = 20, ...filters } = request.query;

    const users = await listUser.execute(page, limit, filters);

    return response.status(users.code).send(users);
  }
}
