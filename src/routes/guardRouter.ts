import { Router } from 'express';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { decodeJwt } from '@middlewares/decodeJwt';
import { IExceptionDTO } from '@dtos/IExceptionDTO';

const guardRouter = Router();

const exceptions: IExceptionDTO = {
  path: [
    {
      url: /^\/keys/,
      methods: ['GET'],
    },
    {
      url: /^\/generate-keys/,
      methods: ['GET'],
    },
    {
      url: /^\/uploads\/.+/,
      methods: ['GET'],
    },
    {
      url: /^\/api-docs([\/?].*)?/,
      methods: ['GET'],
    },
    {
      url: /^\/register/,
      methods: ['POST'],
    },
    {
      url: /^\/login/,
      methods: ['POST'],
    },
    {
      url: /^\/password\/.*/,
      methods: ['POST'],
    },
  ],
};

guardRouter.use(ensureAuthenticated.unless(exceptions));
guardRouter.use(decodeJwt);

export { guardRouter };
