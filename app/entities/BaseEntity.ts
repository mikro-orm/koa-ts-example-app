import { PrimaryKey, Property } from '@mikro-orm/better-sqlite';

export abstract class BaseEntity {

  @PrimaryKey()
  id!: number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

}
