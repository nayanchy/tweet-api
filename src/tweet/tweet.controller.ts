import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { Tweet } from './tweet.entity';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}
  @Get()
  getAllTweets(): Promise<Tweet[]> {
    return this.tweetService.getTweets();
  }
  // @Get()
  // getTweets(@Query('userId', ParseIntPipe) userId?: number): Promise<Tweet[]> {
  //   return this.tweetService.getTweets(userId);
  // }

  @Get(':userId')
  getTweets(@Param('userId', ParseIntPipe) userId?: number): Promise<Tweet[]> {
    return this.tweetService.getTweets(userId);
  }

  @Post()
  public async createTweet(@Body() tweet: CreateTweetDto) {
    const res = await this.tweetService.createTweet(tweet);

    return res;
  }

  @Delete(':id')
  public async deleteTweet(@Param('id', ParseIntPipe) id: number) {
    const res = await this.tweetService.deleteTweet(id);

    return res;
  }
}
