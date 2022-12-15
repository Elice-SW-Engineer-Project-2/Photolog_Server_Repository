import { Column, Entity, OneToMany } from 'typeorm';
import { Cameras } from './Cameras';
import { Lenses } from './Lenses';

@Entity('companies', { schema: 'photolog' })
export class Companies {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 100 })
  name: string | null;

  @OneToMany(() => Cameras, (cameras) => cameras.company)
  cameras: Cameras[];

  @OneToMany(() => Lenses, (lenses) => lenses.company)
  lenses: Lenses[];
}
