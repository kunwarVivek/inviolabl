// File path: src/tenant/entities/tenant.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("tenant")
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  domain: string;
}
