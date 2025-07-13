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

@Injectable()
export class TweetService {
  constructor(
    private readonly userService: UserService,
    private readonly hashtagService: HashtagService,
    private readonly paginationProvider: PaginationProvider,

    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
  ) {}

  public async getTweets(userId?: number, paginationDto?: PaginationDto) {
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
    const tweet = await this.tweetRepository.findOneBy({ id });

    if (!tweet) {
      throw new BadRequestException('Tweet not found');
    }

    return tweet;
  }

  public async createTweet(tweetDto: CreateTweetDto) {
    const user = await this.userService.getUserById(tweetDto.userId);
    const hashtags = await this.hashtagService.findHashtags(
      tweetDto.hashtags as number[],
    );
    const tweet = this.tweetRepository.create({
      ...tweetDto,
      user,
      hashtags,
    });

    return this.tweetRepository.save(tweet);
  }

  public async deleteTweet(id: number) {
    const isTweetExist = await this.getTweetsById(id);

    if (isTweetExist) {
      const deletedTweet = this.tweetRepository.delete(id);

      return {
        status: 'success',
        message: 'Tweet deleted',
        deletedTweet,
      };
    }
  }
}
