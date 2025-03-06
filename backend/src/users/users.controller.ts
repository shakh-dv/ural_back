import {Body, Controller, Get, Param, ParseIntPipe, Put} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDTO} from './dtos/update-user-dto';
import {User} from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getById(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDTO
  ): Promise<User> {
    return this.usersService.update(id, data);
  }
}
