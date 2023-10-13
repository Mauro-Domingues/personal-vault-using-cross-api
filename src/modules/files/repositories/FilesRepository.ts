import { File } from '@modules/files/entities/File';
import { IFilesRepositoryDTO } from '@modules/files/repositories/IFilesRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class FilesRepository
  extends BaseRepository<File>
  implements IFilesRepositoryDTO
{
  constructor() {
    super(File);
  }

  // non-generic methods here
}
