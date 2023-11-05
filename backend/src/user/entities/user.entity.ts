// src/user/entities/user.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')  // Specify the table name if it's not 'user'
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  
  @Column()
  email: string;
  
  @Column()
  password: string;

  
  @Column()
  username: string;

  @Column()
  image: string;


  @Column()
  provider: string;


}
