import { Options } from '@mikro-orm/core';
import { Author, Book, BookTag, Publisher, BaseEntity } from './entities';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const config: Options = {
  type: 'sqlite',
  dbName: 'test.db',
  // as we are using class references here, we don't need to specify `entitiesTs` option
  entities: [Author, Book, BookTag, Publisher, BaseEntity],
  highlighter: new SqlHighlighter(),
  debug: true,
};

export default config;
