import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Query() query: any, @Param() param: any) {
    console.log(param);
    const result = await this.userService.getUsers(query);

    return result;
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userService.getUserById(id);

    return result;
  }

  @Patch(':id')
  updateUser(@Body() data, @Param('id', ParseIntPipe) id: number) {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
