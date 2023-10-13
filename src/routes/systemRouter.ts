import { Router } from 'express';

import { GenerateKeyControllerController } from '@modules/system/services/generateKey/GenerateKeyController';

const systemRouter = Router();
const generateKeyControllerController = new GenerateKeyControllerController();

systemRouter.get('/generate-keys', generateKeyControllerController.handle);

export { systemRouter };
