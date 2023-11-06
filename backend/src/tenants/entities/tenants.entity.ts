// File path: src/tenant/entities/tenant.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("tenant")
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true })
  name: string;

  @Column({nullable: true })
  domain: string;
}
