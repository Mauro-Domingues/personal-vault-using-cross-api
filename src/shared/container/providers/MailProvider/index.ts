import { mailConfig } from '@config/mail';
import { container } from 'tsyringe';

import { NodemailerMailProvider } from './implementations/NodemailerMailProvider';
import { SESMailProvider } from './implementations/SESMailProvider';
import { IMailProviderDTO } from './models/IMailProvider';

const providers = {
  nodemailer: container.resolve(NodemailerMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProviderDTO>(
  'MailProvider',
  providers[mailConfig.driver],
);
