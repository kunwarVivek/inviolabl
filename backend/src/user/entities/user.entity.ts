// src/user/entities/user.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')  // Specify the table name if it's not 'user'
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  
  @Column({nullable: true })
  email: string;
  
  @Column({nullable: true })
  password: string;

  
  @Column({nullable: true })
  username: string;

  @Column({nullable: true })
  image: string;
  @Column({nullable: true })
  name: string;
  @Column({nullable: true })
  provider: string;
  
}
