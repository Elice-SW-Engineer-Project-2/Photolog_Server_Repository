import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  createPost(createPostDto: CreatePostDto) {
    // 1. 게시물, 이미지 url 등록 같이

    // 2. 등록된 게시물, 이미지 url id들을 가지고 사진 등록

    // 3. 해시태그 등록

    return 'This action adds a new post';
  }

  readAllPosts() {
    return `This action returns all posts`;
  }

  readPost(id: number) {
    return `This action returns a #${id} post`;
  }

  updatePost(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  deletePost(id: number) {
    return `This action removes a #${id} post`;
  }
}
