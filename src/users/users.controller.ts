import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: Partial<User>): Promise<User> {
    return await this.usersService.create(user);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Get('/name/:username')
  async findByUsername(@Param('username') username): Promise<User> {
    return await this.usersService.findByUsername(username);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  @HttpCode(204)
  async update(@Param('id') id, @Body() user: Partial<User>): Promise<void> {
    return await this.usersService.update(id, user);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id): Promise<void> {
    return await this.usersService.remove(id);
  }
}
