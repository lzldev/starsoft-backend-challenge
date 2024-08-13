import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class Message {
  @ApiProperty()
  key: string;
  @ApiProperty()
  headers: Record<string, string>;
  @ApiProperty()
  data: any;
}

@Entity()
export class Events {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: Message,
  })
  @Column('jsonb')
  log: Message;
}
