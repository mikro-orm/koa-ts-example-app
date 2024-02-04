import { QueryOrder } from '@mikro-orm/better-sqlite';
import { Context } from 'koa';
import Router from 'koa-router';

import { DI } from '../server';
import { Author } from '../entities';
import { z } from 'zod';

const router = new Router();

router.get('/', async (ctx: Context) => {
  ctx.body = await DI.authors.findAll({
    populate: ['books'],
    orderBy: { name: QueryOrder.DESC },
    limit: 20,
  });
});

router.get('/:id', async (ctx: Context) => {
  try {
    const query = z.object({ id: z.number() }).parse(ctx.query);
    const author = await DI.authors.findOne(query.id, { populate: ['books'] });

    if (!author) {
      return ctx.throw(404, { message: 'Author not found' });
    }

    ctx.body = author;
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.post('/', async (ctx: Context) => {
  if (!ctx.request.body.name || !ctx.request.body.email) {
    return ctx.throw(400, { message: 'One of `name, email` is missing' });
  }

  try {
    const author = DI.em.create(Author, ctx.request.body);
    await DI.em.flush();

    ctx.body = author;
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.put('/:id', async (ctx: Context) => {
  try {
    const query = z.object({ id: z.number() }).parse(ctx.query);
    const author = await DI.authors.findOne(query.id);

    if (!author) {
      return ctx.throw(404, { message: 'Author not found' });
    }

    DI.em.assign(author, ctx.request.body);
    await DI.em.flush();

    ctx.body = author;
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

export const AuthorController = router;
