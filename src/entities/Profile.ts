import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ImageUrl } from './ImageUrl';
import { Users } from './Users';

@Index('FK_imageURL_TO_profile_1', ['imageId'], {})
@Index('FK_users_TO_profile_1', ['userId'], {})
@Entity('profile', { schema: 'photolog' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { primary: true, name: 'imageId' })
  imageId: number;

  @Column('int', { primary: true, name: 'userId' })
  userId: number;

  @ManyToOne(() => ImageUrl, (imageUrl) => imageUrl.profiles, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'imageId', referencedColumnName: 'id' }])
  image: ImageUrl;

  @ManyToOne(() => Users, (users) => users.profiles, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: Users;
}
