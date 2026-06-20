import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  LoginInput,
  RegisterInput,
  UsersService,
} from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() body: RegisterInput) {
    return this.usersService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginInput) {
    return this.usersService.login(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  updateName(@Param('id') id: string, @Body('name') name: string) {
    return this.usersService.updateName(id, name);
  }
}
