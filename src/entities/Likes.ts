import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Posts } from './Posts';
import { Users } from './Users';

@Index('FK_users_TO_likes_1', ['userId'], {})
@Index('FK_posts_TO_likes_1', ['postId'], {})
@Entity('likes', { schema: 'photolog' })
export class Likes {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('int', { primary: true, name: 'userId' })
  userId: number;

  @Column('int', { primary: true, name: 'postId' })
  postId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Posts, (posts) => posts.likes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'postId', referencedColumnName: 'id' }])
  post: Posts;

  @ManyToOne(() => Users, (users) => users.likes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: Users;
}
