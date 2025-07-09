import { Hono } from 'hono'
import mongoose from 'mongoose'
import moduleRoute from './api/module'
import { cors } from 'hono/cors'
import { getConnInfo } from 'hono/bun'
import { rateLimiter } from 'hono-rate-limiter'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
import userRouter from './api/users'
import { login } from './middleware/auth'
import categoryRouter from './api/category'

/**
 * MongoDB Connection
 */
mongoose.connect(process.env.DB_API || '')
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err))

const app = new Hono()

/**
 * Pretty JSON formatter for responses
 */
app.use(prettyJSON())

/**
 * CORS Configuration
 * - Sesuaikan origin sesuai kebutuhan produksi || Adjust origin according to production needs
 */
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Authorization', 'Content-Type']
}))


/**
 * Rate Limiter Middleware
 */
app.use('*', rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100000,
  standardHeaders: 'draft-6',
  keyGenerator(c) {
    const info = getConnInfo(c)
    return info.remote.address || 'unknown'
  },
  message: '⚠️ Too many requests, please try again after some time.'
}))

/**
 * Logger Middleware
 */
app.use('*', async (c, next) => {
  const { method, path } = c.req
  const info = getConnInfo(c)
  const start = Date.now()

  const res = await next()

  const ms = Date.now() - start
  const status = c.res.status

  console.log(`IP ${info.remote.address} [${method}] ${path} - ${status} (${ms}ms)`)

  return res
})

/**
 * Security Headers Middleware
 */
app.use('*', secureHeaders({
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
  originAgentCluster: '?1',
  xPermittedCrossDomainPolicies: 'none',
  xDnsPrefetchControl: 'off',
  xDownloadOptions: 'noopen',
  xXssProtection: '0',
  crossOriginResourcePolicy: 'cross-origin',
}))

/**
 * Global Error Handler Middleware
 */
app.use('*', async (c, next) => {
  try {
    return await next()
  } catch (err) {
    console.error('Unhandled error:', err)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

/**
 * API Routes
 */
app.route('/api/category/', categoryRouter)
app.route('/api/module/', moduleRoute)
app.route('/api/user/', userRouter)
app.post('/api/login/', login)

export default {
  host: process.env.HOST,
  port: process.env.PORT,
  fetch: app.fetch
}
