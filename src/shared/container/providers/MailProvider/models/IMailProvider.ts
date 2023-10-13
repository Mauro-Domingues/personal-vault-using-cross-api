import { ISendMailDTO } from '../dtos/ISendMailDTO';

export interface IMailProviderDTO {
  sendMail(data: ISendMailDTO): Promise<void>;
}
