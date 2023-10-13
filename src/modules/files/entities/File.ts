import { Entity, Column } from 'typeorm';
import { Base } from '@shared/container/modules/entities/Base';
import { Connection } from '@shared/typeorm';
import { uploadConfig } from '@config/upload';
import { Expose } from 'class-transformer';

@Entity('files', { database: Connection.client })
export class File extends Base {
  file_url: string | null;

  @Column({ type: 'varchar', nullable: false })
  file: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Expose({ name: 'file_url' })
  getFileUrl(): string | null {
    if (!this.file) {
      return null;
    }
    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.API_URL}/uploads/${this.file}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.file}`;
      default:
        return null;
    }
  }
}
