import { Base } from '@shared/container/modules/entities/Base';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('tokens', { database: process.env.MYSQL_DATABASE })
export class Token extends Base {
  @Column({ type: 'varchar', nullable: true, name: 'user_id' })
  userID: string;

  @Column({ type: 'varchar', nullable: false })
  token: string;

  @OneToOne(() => User, user => user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
