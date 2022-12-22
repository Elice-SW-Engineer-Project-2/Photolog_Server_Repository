import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from './Comments';
import { Likes } from './Likes';
import { Posts } from './Posts';
import { Profile } from './Profile';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users', { schema: 'photolog' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('varchar', { name: 'email', length: 50 })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Exclude({ toPlainOnly: true })
  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Comments, (comments) => comments.user)
  comments: Comments[];

  @OneToMany(() => Likes, (likes) => likes.user)
  likes: Likes[];

  @OneToMany(() => Posts, (posts) => posts.user)
  posts: Posts[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profiles: Profile;
}
