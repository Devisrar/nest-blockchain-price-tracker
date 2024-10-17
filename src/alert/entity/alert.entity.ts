import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AlertEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;

  @Column('decimal')
  price: number;

  @Column()
  email: string;
}
