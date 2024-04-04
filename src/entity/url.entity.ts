import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryColumn()
  shortUrl: string;

  @Column({ type: 'text' })
  originalUrl: string;
}
