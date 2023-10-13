import { IMailTemplateProviderDTO } from '../models/IMailTemplateProvider';

export class FakeMailTemplateProvider implements IMailTemplateProviderDTO {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}
