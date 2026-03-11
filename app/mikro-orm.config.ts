import { defineConfig } from '@mikro-orm/sqlite';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Author, Book, BookTag, Publisher, BaseEntity } from './entities';

export default defineConfig({
  dbName: 'test.db',
  // as we are using class references here, we don't need to specify `entitiesTs` option
  entities: [Author, Book, BookTag, Publisher, BaseEntity],
  metadataProvider: ReflectMetadataProvider,
  dynamicImportProvider: id => import(id),
  highlighter: new SqlHighlighter(),
  debug: true,
});
