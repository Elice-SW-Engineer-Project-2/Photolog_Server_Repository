import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Companies } from './Companies';
import { Images } from './Images';

@Index('FK_companies_TO_cameras_1', ['companyId'], {})
@Entity('cameras', { schema: 'photolog' })
export class Cameras {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('int', { primary: true, name: 'companyId' })
  companyId: number;

  @Column('varchar', { name: 'model', length: 100 })
  model: string | null;

  @ManyToOne(() => Companies, (companies) => companies.cameras, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Companies;

  @OneToMany(() => Images, (images) => images.camera)
  images: Images[];
}
