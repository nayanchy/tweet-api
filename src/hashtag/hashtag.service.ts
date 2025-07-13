import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hashtag } from './hashtag.entity';
import { In, Repository } from 'typeorm';
import { CreateHashtagDto } from './dto/create-hashtag.dto';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
  ) {}

  public async getAllHashtags() {
    return await this.hashtagRepository.find();
  }

  public async getHashtagById(id: number) {
    return await this.hashtagRepository.findOneBy({ id });
  }

  public async findHashtags(hashtags: number[]) {
    return await this.hashtagRepository.find({
      where: {
        id: In(hashtags),
      },
    });
  }

  public async createHashtag(hashtagDto: CreateHashtagDto) {
    const modifiedDto = {
      ...hashtagDto,
      name: hashtagDto.name.toLowerCase(),
    };
    const notUnique = await this.hashtagRepository.findOneBy({
      name: modifiedDto.name,
    });

    if (notUnique) {
      throw new BadRequestException('Hashtag already exists');
    } else {
      const hashtag = this.hashtagRepository.create(modifiedDto);

      return this.hashtagRepository.save(hashtag);
    }
  }

  public async deleteHashtag(id: number) {
    const deletedHashtag = await this.hashtagRepository.delete(id);
    return {
      status: 'success',
      message: 'Hashtag deleted',
      deletedHashtag,
    };
  }

  public async softDeleteHashtag(id: number) {
    const deletedHashtag = await this.hashtagRepository.softDelete(id);
    return {
      status: 'success',
      message: 'Hashtag deleted',
      deletedHashtag,
    };
  }
}
