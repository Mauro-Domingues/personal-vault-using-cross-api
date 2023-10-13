import { File } from '@modules/files/entities/File';
import { IFilesRepositoryDTO } from '@modules/files/repositories/IFilesRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakeFilesRepository
  extends FakeBaseRepository<File>
  implements IFilesRepositoryDTO {
  // non-generic methods here
}
