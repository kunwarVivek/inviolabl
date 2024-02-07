// files.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { FilesEntity } from './files.entity';
import { FilesDto } from './dtos/files.dto';
import { AddressEntity } from './address.entity';
import { CidEntity } from './cid.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesRepository: Repository<FilesEntity>,
  ) { }

  async create(filesDto: FilesDto): Promise<FilesEntity> {
    const filesEntity = new FilesEntity();
    filesEntity.email = filesDto.email!;
    filesEntity.addresses = filesDto.addresses!;
    filesEntity.cids = filesDto.cids!;

    try {
      return await this.filesRepository.save(filesEntity);
    } catch (error) {
      throw new ConflictException('Email already exists');
    }
  }

  async findOneByEmail(email: string): Promise<FilesEntity> {
    const files = await this.filesRepository.findOne({ where: { email }, relations: ['addresses', 'cids'] });
    if (!files) {
      throw new NotFoundException('Files not found');
    }
    return files;
  }

  async addAddress(email: string, address: string): Promise<FilesEntity> {
    let files = await this.filesRepository.findOne({ where: { email }, relations: ['addresses'] });
    if (!files) {
      throw new NotFoundException('Files not found for email');
    }
    if (!files.addresses) {
      files.addresses = [];
    }
    files.addresses.push({ address } as AddressEntity);
    return await this.filesRepository.save(files);
  }

  async addCid(email: string, cid: string): Promise<FilesEntity> {
    let files = await this.filesRepository.findOne({ where: { email }, relations: ['cids'] });
    if (!files) {
      throw new NotFoundException('Files not found for email');
    }
    if (!files.cids) {
      files.cids = [];
    }
    files.cids.push({ cid } as CidEntity);
    return await this.filesRepository.save(files);
  }

  async removeCid(email: string, cid: string): Promise<FilesEntity> {
    let files = await this.filesRepository.findOne({ where: { email }, relations: ['cids'] });
    if (!files) {
      throw new NotFoundException('Files not found for email');
    }
    if (!files.cids || files.cids.length === 0) {
      throw new NotFoundException('No cids found for email');
    }
    files.cids = files.cids.filter(c => c.cid !== cid);
    return await this.filesRepository.save(files);
  }

  async shareCid(senderEmail: string, recipientEmail: string, cid: string): Promise<void> {
    const filesRepository = getRepository(FilesEntity);
    const [senderFiles, recipientFiles] = await Promise.all([
      filesRepository.findOne({ where: { email: senderEmail }, relations: ['cids'] }),
      filesRepository.findOne({ where: { email: recipientEmail }, relations: ['cids'] })
    ]);

    if (!senderFiles) {
      throw new NotFoundException('Files not found for sender email');
    }
    if (!recipientFiles) {
      throw new NotFoundException('Files not found for recipient email');
    }

    const cidExists = senderFiles.cids && senderFiles.cids.some(c => c.cid === cid);
    if (!cidExists) {
      throw new NotFoundException('CID not found for sender email');
    }

    if (!recipientFiles.cids) {
      recipientFiles.cids = [];
    }

    const cidAlreadyShared = recipientFiles.cids.some(c => c.cid === cid);
    if (cidAlreadyShared) {
      throw new ConflictException('CID already shared with recipient email');
    }

    recipientFiles.cids.push({ cid } as CidEntity);
    await filesRepository.save(recipientFiles);
  }
}
