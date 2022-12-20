import { Injectable } from '@nestjs/common';
import { Posts } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PostsDao {
  constructor(
    @InjectRepository(Posts)
    private readonly usersRepository: Repository<Posts>,
    private dataSource: DataSource,
  ) {}
}
