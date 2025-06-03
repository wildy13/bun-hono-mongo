import { Hono } from 'hono'
import mongoose from 'mongoose'
import moduleRoute from './api/module/index';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { proxy } from 'hono/proxy';

mongoose.connect(`${process.env.DB_API}`)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err))

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use('*', logger())

app.route('/api/module/', moduleRoute);

export default {
  host: process.env.HOST,
  port: Number(process.env.PORT),
  fetch: app.fetch
}
