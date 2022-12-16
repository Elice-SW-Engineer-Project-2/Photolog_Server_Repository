import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Images } from './Images';
import { Profile } from './Profile';

@Entity('imageURL', { schema: 'photolog' })
export class ImageUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'url', length: 255 })
  url: string | null;

  @OneToMany(() => Images, (images) => images.image)
  images: Images[];

  @OneToMany(() => Profile, (profile) => profile.image)
  profiles: Profile[];
}
