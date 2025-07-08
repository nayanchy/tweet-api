import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  lastName: string;
  @Column({
    type: 'int',
    nullable: true,
  })
  age: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  gender: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 1000,
  })
  address: string;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  isMarried: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dateOfBirth: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  profileImage: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
