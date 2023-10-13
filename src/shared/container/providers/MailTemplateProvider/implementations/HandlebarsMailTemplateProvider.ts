import { readFileSync } from 'fs';
import { compile } from 'handlebars';

import { IParseMailTemplateDTO } from '../dtos/IParseMailTemplateDTO';
import { IMailTemplateProviderDTO } from '../models/IMailTemplateProvider';

export class HandlebarsMailTemplateProvider
  implements IMailTemplateProviderDTO
{
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = readFileSync(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = compile(templateFileContent);

    return parseTemplate(variables);
  }
}
