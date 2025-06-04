import { Hono } from 'hono'
import mongoose from 'mongoose'
import moduleRoute from './api/module/index';
import { cors } from 'hono/cors';
import { getConnInfo } from 'hono/bun';
import { rateLimiter } from 'hono-rate-limiter';

mongoose.connect(`${process.env.DB_API}`)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err))

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-6',
    keyGenerator(c) {
      const info = getConnInfo(c)
      // console.log(`RateLimit Key (IP): ${info.remote.address}`)
      return `RateLimit Key (IP): ${info.remote.address}`
    },
    message: '⚠️ Too many requests, please try again after some time.',
  })
)

app.use('*', async (c, next) => {
  const { method, path } = c.req
  const start = Date.now()
  const info = getConnInfo(c)

  await next()

  const ms = Date.now() - start
  const status = c.res.status

  console.log(`IP ${info.remote.address} [${method}] ${path} - ${status} (${ms}ms)`)
})

app.route('/api/module/', moduleRoute);

export default {
  host: process.env.HOST,
  port: Number(process.env.PORT),
  fetch: app.fetch
}
