import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MongoRepository } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,    
  ) {}

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

  @Put(':id')
  @HttpCode(204)
  async update(@Param('id') id, @Body() user: Partial<User>): Promise<void> {
    return await this.usersService.update(id, user);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id): Promise<void> {
    return await this.usersService.remove(id);
  }
}
