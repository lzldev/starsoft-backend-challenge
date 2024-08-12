import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { Message } from 'kafkajs';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  log: Message;
}
