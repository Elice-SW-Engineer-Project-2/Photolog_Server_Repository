import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from './Comments';
import { Likes } from './Likes';
import { Posts } from './Posts';
import { Profile } from './Profile';

@Entity('users', { schema: 'photolog' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'email', length: 50 })
  email: string;

  @Column('varchar', { name: 'password', nullable: true, length: 20 })
  password: string | null;

  @Column('varchar', { name: 'profileImage', nullable: true, length: 255 })
  profileImage: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Comments, (comments) => comments.user)
  comments: Comments[];

  @OneToMany(() => Likes, (likes) => likes.user)
  likes: Likes[];

  @OneToMany(() => Posts, (posts) => posts.user)
  posts: Posts[];

  @OneToMany(() => Profile, (profile) => profile.user)
  profiles: Profile[];
}
