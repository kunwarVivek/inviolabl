
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({unique:true,nullable:false})
  name!: string;

  @Column()
  gasPolicy!: string;
}
