import { QueryOrder } from '@mikro-orm/core';
import { Context } from 'koa';
import Router from 'koa-router';

import { DI } from '../server';
import { Author } from '../entities';

const router = new Router();

router.get('/', async (ctx: Context) => {
  ctx.body = await DI.authorRepository.findAll(['books'], { name: QueryOrder.DESC }, 20);
});

router.get('/:id', async (ctx: Context) => {
  try {
    const author = await DI.authorRepository.findOne(ctx.params.id, ['books']);

    if (!author) {
      return ctx.throw(404, { message: 'Author not found' });
    }

    ctx.body = author;
  } catch (e) {
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
    await DI.authorRepository.persist(author).flush();

    ctx.body = author;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.put('/:id', async (ctx: Context) => {
  try {
    const author = await DI.authorRepository.findOne(ctx.params.id);

    if (!author) {
      return ctx.throw(404, { message: 'Author not found' });
    }

    DI.em.assign(author, ctx.request.body);
    await DI.authorRepository.persist(author).flush();

    ctx.body = author;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

export const AuthorController = router;
