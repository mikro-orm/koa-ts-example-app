import 'reflect-metadata';

import Koa, { Context } from 'koa';
import Router from 'koa-router';
import { koaBody } from 'koa-body';
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/better-sqlite';

import { AuthorController, BookController } from './controllers';
import { Author, Book } from './entities';

export const DI = {} as {
  orm: MikroORM,
  em: EntityManager,
  authors: EntityRepository<Author>,
  books: EntityRepository<Book>,
};

export const app = new Koa();

// Entry point for all modules.
const api = new Router();
api.get('/', (ctx: Context) => ctx.body = { message: 'Welcome to MikroORM Koa TS example, try CRUD on /author and /book endpoints!' });
api.use('/author', AuthorController.routes());
api.use('/book', BookController.routes());

const port = process.env.PORT || 3000;

(async () => {
  DI.orm = await MikroORM.init(); // CLI config will be used automatically
  DI.em = DI.orm.em;
  DI.authors = DI.orm.em.getRepository(Author);
  DI.books = DI.orm.em.getRepository(Book);

  await DI.orm.schema.updateSchema();

  app.use(koaBody());
  app.use((ctx, next) => RequestContext.create(DI.orm.em, next));
  app.use(api.routes());
  app.use(api.allowedMethods());
  app.use((ctx, next) => {
    ctx.status = 404;
    ctx.body = { message: 'No route found' };
  });

  app.listen(port, () => {
    console.log(`MikroORM Koa TS example started at http://localhost:${port}`);
  });
})();
