import { Router } from 'express';

import { CreateFileController } from '@modules/files/services/createFile/CreateFileController';
import { ShowFileController } from '@modules/files/services/showFile/ShowFileController';
import { ListFileController } from '@modules/files/services/listFile/ListFileController';
import { UpdateFileController } from '@modules/files/services/updateFile/UpdateFileController';
import { DeleteFileController } from '@modules/files/services/deleteFile/DeleteFileController';
import { uploadConfig } from '@config/upload';
import multer from 'multer';

const fileRouter = Router();
const upload = multer(uploadConfig.multer);
const createFileController = new CreateFileController();
const listFileController = new ListFileController();
const showFileController = new ShowFileController();
const updateFileController = new UpdateFileController();
const deleteFileController = new DeleteFileController();

fileRouter.post('/files', upload.single('file'), createFileController.handle);
fileRouter.get('/files', listFileController.handle);
fileRouter.get('/files/:id', showFileController.handle);
fileRouter.put(
  '/files/:id',
  upload.single('file'),
  updateFileController.handle,
);
fileRouter.delete('/files/:id', deleteFileController.handle);

export { fileRouter };
