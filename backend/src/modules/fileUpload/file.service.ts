import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './file.entity';


@Injectable()
export class FileService {
    constructor(
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
    ) { }

    async uploadFiles(
        files: Express.Multer.File[],
        email: string,
        domainId: string
    ): Promise<void> {
        const fileEntities: FileEntity[] = files.map(file => {
            const fileEntity = new FileEntity();
            fileEntity.fileName = file.originalname;
            fileEntity.fileSize = file.size;
            fileEntity.domainId = domainId;
            fileEntity.data = file.buffer
            fileEntity.email = email;
            fileEntity.uploadedBy = email;
            return fileEntity;
        });

        await this.fileRepository.save(fileEntities);
    }

    async getFilesByDomainId(domainId: string): Promise<FileEntity[]> {
        return this.fileRepository.find({ where: { domainId } });
    }

    async getAllFiles(): Promise<FileEntity[]> {
        return this.fileRepository.find();
      }
}
