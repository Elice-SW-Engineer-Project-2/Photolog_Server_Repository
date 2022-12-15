import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  hello() {
    console.log('service도달');
  }
}
