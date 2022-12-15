import { Controller, Get, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exceptions/httpException.filter';
import { UsersService } from './users.service';

@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  hello() {
    this.usersService.hello();
  }
}
