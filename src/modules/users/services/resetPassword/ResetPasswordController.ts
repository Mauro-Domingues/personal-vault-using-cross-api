import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ResetPasswordService } from './ResetPasswordService';

export class ResetPasswordController {
  public async handle(
    request: Request<{ token: string }, never, { password: string }>,
    response: Response<void>,
  ) {
    const { password } = request.body;
    const { token } = request.params;

    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute(token, password);

    return response.status(200).send();
  }
}
