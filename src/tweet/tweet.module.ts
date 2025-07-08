import { Module } from '@nestjs/common';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { UserModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { HashtagModule } from 'src/hashtag/hashtag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet]), UserModule, HashtagModule],
  controllers: [TweetController],
  providers: [TweetService],
})
export class TweetModule {}
