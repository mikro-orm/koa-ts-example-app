import { Cascade, Collection, Entity, OneToMany, Property, ManyToOne, Unique } from '@mikro-orm/better-sqlite';

import { Book } from '.';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Author extends BaseEntity {

  @Property()
  name: string;

  @Property()
  @Unique()
  email: string;

  @Property({ nullable: true })
  age?: number;

  @Property()
  termsAccepted = false;

  @Property({ nullable: true })
  born?: Date;

  @OneToMany(() => Book, b => b.author, { cascade: [Cascade.ALL] })
  books = new Collection<Book>(this);

  @ManyToOne(() => Book, { nullable: true })
  favouriteBook?: Book;

  constructor(name: string, email: string) {
    super();
    this.name = name;
    this.email = email;
  }

}
