import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SendForgotPasswordEmailService } from './SendForgotPasswordEmailService';

export class SendForgotPasswordEmailController {
  public async handle(
    request: Request<never, never, { email: string }>,
    response: Response<void>,
  ) {
    const { email } = request.body;
    const { ip } = request;

    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService,
    );

    await sendForgotPasswordEmail.execute(email, ip);

    return response.status(200).send();
  }
}
