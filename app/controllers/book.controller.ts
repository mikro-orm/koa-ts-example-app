import { QueryOrder, wrap } from '@mikro-orm/core';
import { Context } from 'koa';
import Router from 'koa-router';

import { DI } from '../server';

const router = new Router();

router.get('/', async (ctx: Context) => {
  ctx.body = await DI.bookRepository.findAll(['author'], { title: QueryOrder.DESC }, 20);
});

router.get('/:id', async (ctx: Context) => {
  try {
    const book = await DI.bookRepository.findOne(ctx.query.id, ['author']);

    if (!book) {
      return ctx.throw(404, { message: 'Book not found' });
    }

    ctx.body = book;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.post('/', async (ctx: Context) => {
  if (!ctx.request.body.title || !ctx.request.body.author) {
    ctx.throw(400, { message: 'One of `title, author` is missing' });
  }

  try {
    const book = DI.bookRepository.create(ctx.request.body);
    await DI.bookRepository.persist(book).flush();

    ctx.body = book;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.put('/:id', async (ctx: Context) => {
  try {
    const book = await DI.bookRepository.findOne(ctx.query.id);

    if (!book) {
      return ctx.throw(404, { message: 'Book not found' });
    }

    wrap(book).assign(ctx.request.body);
    await DI.bookRepository.persist(book).flush();

    ctx.body = book;
  } catch (e) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

export const BookController = router;
