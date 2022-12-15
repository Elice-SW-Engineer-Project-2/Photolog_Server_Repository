import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from './Comments';
import { Hashtags } from './Hashtags';
import { Images } from './Images';
import { Likes } from './Likes';
import { Users } from './Users';

@Index('FK_users_TO_posts_1', ['userId'], {})
@Entity('posts', { schema: 'photolog' })
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { primary: true, name: 'userId' })
  userId: number;

  @Column('varchar', { name: 'title', length: 255 })
  title: string;

  @Column('text', { name: 'content' })
  content: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Comments, (comments) => comments.post)
  comments: Comments[];

  @OneToMany(() => Hashtags, (hashtags) => hashtags.post)
  hashtags: Hashtags[];

  @OneToMany(() => Images, (images) => images.post)
  images: Images[];

  @OneToMany(() => Likes, (likes) => likes.post)
  likes: Likes[];

  @ManyToOne(() => Users, (users) => users.posts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: Users;
}
