import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 50,
    unique: true,
  })
  username: string;

  @Column('varchar', {
    length: 100,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column('varchar', {
    length: 100,
  })
  hashed_password: string;

  @Column('enum', {
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
