import { Entity, Enum, OneToMany, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/sqlite';
import { Book } from '.';

export enum PublisherType {
  LOCAL = 'local',
  GLOBAL = 'global',
}

@Entity()
export class Publisher {

  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Enum(() => PublisherType)
  type: PublisherType;

  @OneToMany(() => Book, b => b.publisher)
  books = new Collection<Book>(this);

  constructor(name: string, type = PublisherType.LOCAL) {
    this.name = name;
    this.type = type;
  }

}
