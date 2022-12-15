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
import { Cameras } from './Cameras';
import { ImageUrl } from './ImageUrl';
import { Lenses } from './Lenses';
import { Posts } from './Posts';

@Index('FK_posts_TO_images_1', ['postId'], {})
@Index('FK_imageURL_TO_images_1', ['imageId'], {})
@Index('FK_lenses_TO_images_1', ['lensId'], {})
@Index('FK_cameras_TO_images_1', ['cameraId'], {})
@Entity('images', { schema: 'photolog' })
export class Images {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('int', { primary: true, name: 'postId' })
  postId: number;

  @Column('int', { primary: true, name: 'imageId' })
  imageId: number;

  @Column('int', { primary: true, name: 'lensId' })
  lensId: number;

  @Column('int', { primary: true, name: 'cameraId' })
  cameraId: number;

  @Column('double', { name: 'lattitude', precision: 22 })
  lattitude: number | null;

  @Column('double', { name: 'longitude', precision: 22 })
  longitude: number | null;

  @Column('text', { name: 'locationInfo' })
  locationInfo: string | null;

  @Column('datetime', { name: 'takenAt' })
  takenAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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
  @JoinColumn([{ name: 'imageId', referencedColumnName: 'id' }])
  image: ImageUrl;

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
