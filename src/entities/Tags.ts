import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Hashtags } from './Hashtags';

@Entity('tags', { schema: 'photolog' })
export class Tags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 20 })
  name: string | null;

  @OneToMany(() => Hashtags, (hashtags) => hashtags.tag)
  hashtags: Hashtags[];
}
