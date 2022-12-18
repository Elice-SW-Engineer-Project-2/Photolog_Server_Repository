import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ImageUrl } from './ImageUrl';
import { Users } from './Users';

@Index('FK_imageURL_TO_profile_1', ['imageUrlId'], {})
@Index('FK_users_TO_profile_1', ['userId'], {})
@Entity('profile', { schema: 'photolog' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', {
    name: 'imageUrlId',
    unique: true,
    nullable: true,
  })
  imageUrlId: number;

  @Column('int', { name: 'userId' })
  userId: number;

  @ApiProperty()
  @Column('varchar', { name: 'nickname', length: 20 })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ManyToOne(() => ImageUrl, (imageUrl) => imageUrl.profiles, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'imageUrlId', referencedColumnName: 'id' }])
  image: ImageUrl;

  @OneToOne(() => Users, (users) => users.profiles, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: Users;
}
