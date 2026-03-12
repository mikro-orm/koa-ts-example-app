import { QueryOrder } from '@mikro-orm/sqlite';
import Router from 'koa-router';

import { DI } from '../server';
import { Author } from '../entities';
import { z } from 'zod';

const router = new Router();

router.get('/', async ctx => {
  ctx.body = await DI.authors.findAll({
    populate: ['books'],
    orderBy: { name: QueryOrder.DESC },
    limit: 20,
  });
});

router.get('/:id', async ctx => {
  try {
    const params = z.object({ id: z.coerce.number() }).parse(ctx.params);
    const author = await DI.authors.findOne(params.id, { populate: ['books'] });

    if (!author) {
      return ctx.throw(404, { message: 'Author not found' });
    }

    ctx.body = author;
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.post('/', async ctx => {
  const body = (ctx.request as any).body;

  if (!body.name || !body.email) {
    return ctx.throw(400, { message: 'One of `name, email` is missing' });
  }

  try {
    const author = DI.em.create(Author, body);
    await DI.em.flush();

    ctx.body = author;
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.put('/:id', async ctx => {
  try {
    const params = z.object({ id: z.coerce.number() }).parse(ctx.params);
    const author = await DI.authors.findOne(params.id);

    if (!author) {
      return ctx.throw(404, { message: 'Author not found' });
    }

    DI.em.assign(author, (ctx.request as any).body);
    await DI.em.flush();

    ctx.body = author;
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

export const AuthorController = router;
