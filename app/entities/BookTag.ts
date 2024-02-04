import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/better-sqlite';
import { Book } from '.';

@Entity()
export class BookTag {

  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @ManyToMany(() => Book, b => b.tags)
  books = new Collection<Book>(this);

  constructor(name: string) {
    this.name = name;
  }

}
