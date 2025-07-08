import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';

@Injectable()
export class TweetService {
  constructor(
    private readonly userService: UserService,
    private readonly hashtagService: HashtagService,

    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
  ) {}

  public async getTweets(userId?: number) {
    const user = await this.userService.getUserById(userId as number);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const tweets = await this.tweetRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });

    return tweets;
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
