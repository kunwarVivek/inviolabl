import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Count } from './count.entity';

@Injectable()
export class CountsService {
  constructor(
    @InjectRepository(Count)
    private countsRepository: Repository<Count>,
  ) { }

  async getAllCounts(): Promise<Count[]> {
    return this.countsRepository.find({
      order: {
        id: 'DESC'
      }
    });
  }

  async getCountByCID(cid: string): Promise<Count> {
    try {
      return await this.countsRepository.findOneOrFail({ where: { cid } });
    } catch (error) {
      // Handle the error here
      console.error(`Count with CID ${cid} not found.`);
      throw new Error(`Count with CID ${cid} not found.`);
    }
  }

  async getByCID(cid: string): Promise<Count | false> {
    try {
      return await this.countsRepository.findOneOrFail({ where: { cid } });
    } catch (error) {
      console.error(`Count with CID ${cid} not found.`);
      return false;
    }
  }

  async createCountWithInitialCounts(cid: string, email: string, filename: string, filesize: number, filetype: string): Promise<void> {
    const count = new Count();
    count.cid = cid;
    count.views = 0;
    count.downloads = 0;
    count.email = email;
    count.filename = filename;
    count.filesize = filesize;
    count.filetype = filetype;
    await this.countsRepository.save(count);
  }

  async getNumberOfViews(cid: string): Promise<number> {
    const count = await this.getCountByCID(cid);
    return count ? count.views : 0;
  }

  async getNumberOfDownloads(cid: string): Promise<number> {
    const count = await this.getCountByCID(cid);
    return count ? count.downloads : 0;
  }

  async incrementViews(cid: string): Promise<void> {
    try {
      let count = await this.countsRepository.findOne({ where: { cid } });
      if (!count) {
        count = new Count();
        count.cid = cid;
      }
      count.views++;
      await this.countsRepository.save(count);
    } catch (error: any) {
      console.error('Error incrementing views:', error.message);
      throw new Error('Failed to increment views.');
    }
  }

  async incrementDownloads(cid: string): Promise<void> {
    try {
      let count = await this.countsRepository.findOne({ where: { cid } });
      if (!count) {
        count = new Count();
        count.cid = cid;
      }
      count.downloads++;
      await this.countsRepository.save(count);
    } catch (error: any) {
      console.error('Error incrementing downloads:', error.message);
      throw new Error('Failed to increment downloads.');
    }
  }

  async addSharedEmail(cid: string, email: string): Promise<void> {
    try {
      const count = await this.getCountByCID(cid);
      if (count) {
        count.sharedEmails.push(email);
        await this.countsRepository.save(count);
      } else {
        console.error(`Count with CID ${cid} not found.`);
        throw new Error(`Count with CID ${cid} not found.`);
      }
    } catch (error: any) {
      console.error('Error adding shared email:', error.message);
      throw new Error('Failed to add shared email.');
    }
  }

  async getCountsByEmail(email: string): Promise<Count[] | undefined> {
    try {
      const counts = await this.countsRepository.find({
        where: [
          { email: Like(`%${email}%`) },
          { sharedEmails: Like(`%${email}%`) }
        ],
        order: { id: "DESC" }
      });
      return counts;
    } catch (error: any) {
      console.error(`Error finding counts by email ${email}:`, error.message);
      throw new Error(`Failed to find counts by email ${email}.`);
    }
  }


}
