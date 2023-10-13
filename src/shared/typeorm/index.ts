import { DataSource } from 'typeorm';

export class Connection {
  static client: string;

  static mysql: DataSource;

  // static otherConnection: DataSource
}

// Set entities from each database

// @Entity('name', { database: Connection.client }) // only client database
// @Entity('name', { database: Connection.clientprocess.env.MYSQL_DATABASE }) // only default database
// @Entity('name') // both databases

// Image examples

// import { uploadConfig } from '@config/upload';
// import { Exclude, Expose } from 'class-transformer';
//
// @Exclude()
// @Column({ type: 'varchar', nullable: true })
// image: string
//
// @Expose({ name: "avatar_url" })
// getAvatarUrl(): string | null {
//   if (!this.image) {
//     return null;
//   }
//   switch (uploadConfig.driver) {
//     case "disk":
//       return `${process.env.API_URL}/uploads/${this.image}`;
//     case "s3":
//       return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.image}`;
//     default:
//       return null;
//   }
// }

// Relations examples

// @OneToOne(() => relationEntity, relationEntityParam => relationEntityParam.thisEntityColumn,
// { onDelete: 'OPTION', onUpdate: 'OPTION' })
// @JoinColumn()
// relationEntity: relationEntity;

// @OneToMany(() => relationEntity, relationEntityParam => relationEntityParam.thisEntityColumn,
// { onDelete: 'OPTION', onUpdate: 'OPTION' })
// relationEntity: Array<relationEntity>;

// @ManyToOne(() => relationEntity, relationEntityParam => relationEntityParam.thisEntityColumn,
// { onDelete: 'OPTION', onUpdate: 'OPTION' })
// @JoinColumn({ name: "relationEntity_id" })
// relationEntity: relationEntity;

// @ManyToMany(() => relationEntity, relationEntityParam => relationEntityParam.thisEntityColumn,
// { onDelete: 'OPTION', onUpdate: 'OPTION' })
// @JoinTable({
//   name: 'thisEntity_relationEntity',
//   joinColumn: {
//       name: 'thisEntity_id',
//       referencedColumnName: 'id',
//   },
//   inverseJoinColumn: {
//       name: 'relationEntity_id',
//       referencedColumnName: 'id',
//   },
// })
// relationEntity: Array<relationEntity>;
