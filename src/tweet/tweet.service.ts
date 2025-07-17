import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { PaginationDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/pagination.interface';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';

@Injectable()
export class TweetService {
  constructor(
    private readonly userService: UserService,
    private readonly hashtagService: HashtagService,
    private readonly paginationProvider: PaginationProvider,

    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
  ) {}

  public async getTweets(
    userId?: number,
    paginationDto?: PaginationDto,
  ): Promise<Paginated<Tweet>> {
    try {
      const user = await this.userService.getUserById(userId as number);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const tweets = await this.paginationProvider.paginateQuery(
        paginationDto as PaginationDto,
        this.tweetRepository,
        {
          user: { id: userId },
        },
      );

      return tweets;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async getTweetsById(id: number) {
    try {
      const tweet = await this.tweetRepository.findOneBy({ id });

      if (!tweet) {
        throw new BadRequestException('Tweet not found');
      }

      return tweet;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async createTweet(
    tweetDto: CreateTweetDto,
    userId: ActiveUserType['sub'],
  ) {
    try {
      const user = await this.userService.getUserById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashtags = await this.hashtagService.findHashtags(
        tweetDto.hashtags as number[],
      );

      if (!tweetDto.hashtags || tweetDto.hashtags.length === 0) {
        throw new BadRequestException('At least one hashtag is required');
      }

      const tweet = this.tweetRepository.create({
        ...tweetDto,
        user,
        hashtags,
      });

      return this.tweetRepository.save(tweet);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async deleteTweet(id: number) {
    try {
      const isTweetExist = await this.getTweetsById(id);

      if (isTweetExist) {
        const deletedTweet = this.tweetRepository.delete(id);

        return {
          status: 'success',
          message: 'Tweet deleted',
          deletedTweet,
        };
      }
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Tweet not found');
    }
  }
}
