import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Images } from './Images';
import { Companies } from './Companies';

@Index('FK_companies_TO_lenses_1', ['companyId'], {})
@Entity('lenses', { schema: 'photolog' })
export class Lenses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'companyId' })
  companyId: number;

  @Column('varchar', { name: 'model', length: 100 })
  model: string | null;

  // @Column('varchar', { name: 'focalLength', length: 100 })
  // focalLength: string | null;

  // @Column('float', { name: 'aperture' })
  // aperture: number | null;

  // @Column('enum', { name: 'type', enum: ['prime', 'zoom'] })
  // type: 'prime' | 'zoom' | null;

  @OneToMany(() => Images, (images) => images.lens)
  images: Images[];

  @ManyToOne(() => Companies, (companies) => companies.lenses, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Companies;
}
