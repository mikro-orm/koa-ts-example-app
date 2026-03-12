import { QueryOrder, wrap } from '@mikro-orm/sqlite';
import Router from 'koa-router';

import { DI } from '../server';
import { z } from 'zod';

const router = new Router();

router.get('/', async ctx => {
  ctx.body = await DI.books.findAll({
    populate: ['author'],
    orderBy: { title: QueryOrder.DESC },
    limit: 20,
  });
});

router.get('/:id', async ctx => {
  try {
    const params = z.object({ id: z.coerce.number() }).parse(ctx.params);
    const book = await DI.books.findOne(params.id, { populate: ['author'] });

    if (!book) {
      return ctx.throw(404, { message: 'Book not found' });
    }

    ctx.body = book;
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.post('/', async ctx => {
  const body = (ctx.request as any).body;

  if (!body.title || !body.author) {
    ctx.throw(400, { message: 'One of `title, author` is missing' });
  }

  try {
    const book = DI.books.create(body);
    await DI.em.flush();

    ctx.body = book;
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.put('/:id', async ctx => {
  try {
    const params = z.object({ id: z.coerce.number() }).parse(ctx.params);
    const book = await DI.books.findOne(params.id);

    if (!book) {
      return ctx.throw(404, { message: 'Book not found' });
    }

    wrap(book).assign((ctx.request as any).body);
    await DI.em.flush();

    ctx.body = book;
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

export const BookController = router;
