import { File } from '@modules/files/entities/File';
import { IBaseRepositoryDTO } from '@shared/container/modules/repositories/IBaseRepository';

export interface IFilesRepositoryDTO extends IBaseRepositoryDTO<File> {
  // non-generic methods here
}
