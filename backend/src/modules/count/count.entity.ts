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

  @Column("simple-array")
    sharedEmails: string[];

  @Column()
  filename!: string;

  @Column()
  filesize!: number;

  @Column()
  filetype!: string;
  
    constructor() {
      this.sharedEmails = [];
      this.filename = ""; 
      this.filesize = 0; 
      this.filetype = ""; 
    }  

}
