import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IResponseDTO } from '@dtos/IResponseDTO';
import { IFileDTO } from '@modules/files/dtos/IFileDTO';
import { DeleteFileService } from './DeleteFileService';

export class DeleteFileController {
  public async handle(
    request: Request<IFileDTO>,
    response: Response<IResponseDTO<null>>,
  ) {
    const deleteFile = container.resolve(DeleteFileService);

    const { id } = request.params;

    const file = await deleteFile.execute(id);

    return response.send(file);
  }
}
