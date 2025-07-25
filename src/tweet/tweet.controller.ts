import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { Tweet } from './tweet.entity';
import { PaginationDto } from 'src/common/pagination/dto/pagination-query.dto';
import { QueryDto } from 'src/common/pagination/dto/query.dto';
import { Paginated } from 'src/common/pagination/pagination.interface';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}
  // @Get()
  // getAllTweets(): Promise<Tweet[]> {
  //   return this.tweetService.getTweets();
  // }
  @Get()
  getAllTweets(@Query() queryDto?: QueryDto): Promise<Paginated<Tweet>> {
    return this.tweetService.getTweets(queryDto?.userId, queryDto);
  }

  @Get(':userId')
  getTweetsByUserId(
    @Param('userId', ParseIntPipe) userId?: number,
    @Query() paginationDto?: PaginationDto,
  ): Promise<Paginated<Tweet>> {
    return this.tweetService.getTweets(userId, paginationDto);
  }

  @Post()
  public async createTweet(
    @Body() tweet: CreateTweetDto,
    @ActiveUser('sub') user,
  ) {
    const res = await this.tweetService.createTweet(tweet, user);

    return res;
  }

  @Delete(':id')
  public async deleteTweet(@Param('id', ParseIntPipe) id: number) {
    const res = await this.tweetService.deleteTweet(id);

    return res;
  }
}
