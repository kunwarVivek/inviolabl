import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(Organization)
        private organizationRepository: Repository<Organization>,
    ) { }

    async create({ name, gasPolicy }: { name: string; gasPolicy: string }): Promise<Organization> {
        const organization = this.organizationRepository.create({ name, gasPolicy });
        return await this.organizationRepository.save(organization);
    }

    async findAll(): Promise<Organization[]> {
        return await this.organizationRepository.find();
    }

    async findById(id: string): Promise<Organization> {
        const foundOrganization = await this.organizationRepository.findOne({ where: { id } });
        if (!foundOrganization) {
            throw new NotFoundException(`Organization with ID ${id} not found`);
        }
        return foundOrganization;
    }

    async findByName(name: string): Promise<Organization> {
        const foundOrganization = await this.organizationRepository.findOne({ where: { name } });
        if (!foundOrganization) {
          throw new NotFoundException(`Organization with name ${name} not found`);
        }
        return foundOrganization;
      }
}
