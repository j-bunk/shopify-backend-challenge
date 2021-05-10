import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../auth/user.entity';

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  imageName: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((type) => User, (user) => user.images, { eager: false })
  user: User;

  @Column()
  userId: number;
}
