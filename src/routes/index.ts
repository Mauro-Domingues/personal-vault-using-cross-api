import { Router } from 'express';
import { guardRouter } from './guardRouter';
import { userRouter } from './userRouter';
import { fileRouter } from './fileRouter';
import { systemRouter } from './systemRouter';

const routes = Router();

routes.use(guardRouter);
routes.use('/', systemRouter);
routes.use('/', userRouter);
routes.use('/', fileRouter);

export { routes };
