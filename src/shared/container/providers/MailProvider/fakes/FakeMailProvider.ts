import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProviderDTO } from '../models/IMailProvider';

export class FakeMailProvider implements IMailProviderDTO {
  private readonly messages: Array<ISendMailDTO> = [];

  public async sendMail(message: ISendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}
