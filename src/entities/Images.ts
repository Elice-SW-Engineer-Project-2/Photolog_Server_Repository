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
  UpdateDateColumn,
} from 'typeorm';
import { Cameras } from './Cameras';
import { ImageUrl } from './ImageUrl';
import { Lenses } from './Lenses';
import { Posts } from './Posts';

@Index('FK_posts_TO_images_1', ['postId'], {})
@Index('FK_imageURL_TO_images_1', ['imageUrlId'], {})
@Index('FK_lenses_TO_images_1', ['lensId'], {})
@Index('FK_cameras_TO_images_1', ['cameraId'], {})
@Entity('images', { schema: 'photolog' })
export class Images {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'postId' })
  postId: number;

  @Column('int', { name: 'imageUrlId' })
  imageUrlId: number;

  @Column('int', { name: 'lensId', nullable: true })
  lensId?: number;

  @Column('int', { name: 'cameraId', nullable: true })
  cameraId?: number;

  @Column('double', { name: 'latitude' })
  latitude: number | null;

  @Column('double', { name: 'longitude' })
  longitude: number | null;

  @Column('text', { name: 'locationInfo' })
  locationInfo: string | null;

  @Column('datetime', { name: 'takenAt' })
  takenAt: Date | null;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Cameras, (cameras) => cameras.images, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'cameraId', referencedColumnName: 'companyId' }])
  camera: Cameras;

  @ManyToOne(() => ImageUrl, (imageUrl) => imageUrl.images, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'imageUrlId', referencedColumnName: 'id' }])
  imageUrl: ImageUrl;

  @ManyToOne(() => Lenses, (lenses) => lenses.images, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'lensId', referencedColumnName: 'id' }])
  lens: Lenses;

  @ManyToOne(() => Posts, (posts) => posts.images, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'postId', referencedColumnName: 'id' }])
  post: Posts;
}
