import './providers';

import { container } from 'tsyringe';
import { IUsersRepositoryDTO } from '@modules/users/repositories/IUsersRepository';
import { UsersRepository } from '@modules/users/repositories/UsersRepository';
import { IFilesRepositoryDTO } from '@modules/files/repositories/IFilesRepository';
import { FilesRepository } from '@modules/files/repositories/FilesRepository';
import { ITokensRepositoryDTO } from '@modules/users/repositories/ITokensRepository';
import { TokensRepository } from '@modules/users/repositories/TokensRepository';

container.registerSingleton<IUsersRepositoryDTO>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<ITokensRepositoryDTO>(
  'TokensRepository',
  TokensRepository,
);

container.registerSingleton<IFilesRepositoryDTO>(
  'FilesRepository',
  FilesRepository,
);
