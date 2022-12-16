import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Posts } from './Posts';
import { Tags } from './Tags';

@Index('FK_tags_TO_hashtags_1', ['tagId'], {})
@Entity('hashtags', { schema: 'photolog' })
export class Hashtags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'postId' })
  postId: number;

  @Column('int', { name: 'tagId' })
  tagId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Posts, (posts) => posts.hashtags, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'postId', referencedColumnName: 'id' }])
  post: Posts;

  @ManyToOne(() => Tags, (tags) => tags.hashtags, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'tagId', referencedColumnName: 'id' }])
  tag: Tags;
}
