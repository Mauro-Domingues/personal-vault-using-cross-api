import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IFileDTO } from '@modules/files/dtos/IFileDTO';
import { File } from '@modules/files/entities/File';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { UpdateFileService } from './UpdateFileService';

export class UpdateFileController {
  public async handle(
    request: Request<IFileDTO, never, IFileDTO>,
    response: Response<IResponseDTO<File>>,
  ) {
    const updateFile = container.resolve(UpdateFileService);

    const { id } = request.params;
    const fileData = request.body;

    if (request?.file?.filename) {
      fileData.file = request?.file?.filename;
      fileData.name = request?.file?.originalname;
    }

    const file = await updateFile.execute(fileData, id);

    return response.status(file.code).send(file);
  }
}
