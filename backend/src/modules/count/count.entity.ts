import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Count {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  cid!: string;

  @Column({ default: 0 })
  views!: number;

  @Column({ default: 0 })
  downloads!: number;

  @Column()
  email!: string;

}
