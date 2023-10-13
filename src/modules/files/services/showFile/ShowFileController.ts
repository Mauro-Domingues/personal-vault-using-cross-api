import { File } from '@modules/files/entities/File';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IResponseDTO } from '@dtos/IResponseDTO';
import { IFileDTO } from '@modules/files/dtos/IFileDTO';
import { ShowFileService } from './ShowFileService';

export class ShowFileController {
  public async handle(
    request: Request<IFileDTO>,
    response: Response<IResponseDTO<File>>,
  ) {
    const showFile = container.resolve(ShowFileService);

    const { id } = request.params;

    const file = await showFile.execute(id);

    return response.status(file.code).send(file);
  }
}
