import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PriceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;

  @Column('decimal')
  price: number;

  @Column()
  timestamp: Date;
}
