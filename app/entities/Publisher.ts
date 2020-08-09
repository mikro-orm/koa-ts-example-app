import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Book } from '.';

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

export enum PublisherType {
  LOCAL = 'local',
  GLOBAL = 'global',
}
