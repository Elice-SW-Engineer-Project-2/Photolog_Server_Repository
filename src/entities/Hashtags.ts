import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Posts } from './Posts';
import { Tags } from './Tags';

@Index('FK_tags_TO_hashtags_1', ['tagId'], {})
@Entity('hashtags', { schema: 'photolog' })
@Unique(['postId', 'tagId'])
export class Hashtags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'postId' })
  postId: number;

  @Column('int', { name: 'tagId' })
  tagId: number;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
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
