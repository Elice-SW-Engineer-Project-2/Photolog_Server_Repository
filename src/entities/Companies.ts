import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cameras } from './Cameras';
import { Lenses } from './Lenses';

@Entity('companies', { schema: 'photolog' })
export class Companies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'name', length: 100 })
  name: string | null;

  @OneToMany(() => Cameras, (cameras) => cameras.company)
  cameras: Cameras[];

  @OneToMany(() => Lenses, (lenses) => lenses.company)
  lenses: Lenses[];
}
