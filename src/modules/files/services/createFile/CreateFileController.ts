import { IFileDTO } from '@modules/files/dtos/IFileDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IResponseDTO } from '@dtos/IResponseDTO';
import { File } from '@modules/files/entities/File';
import { CreateFileService } from './CreateFileService';

export class CreateFileController {
  public async handle(
    request: Request<never, never, IFileDTO>,
    response: Response<IResponseDTO<File>>,
  ) {
    const fileData = request.body;
    fileData.file = request?.file?.filename;
    fileData.name = request?.file?.originalname;

    const createFile = container.resolve(CreateFileService);

    const file = await createFile.execute(fileData);

    return response.status(file.code).send(file);
  }
}
