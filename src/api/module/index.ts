import { Hono } from 'hono'
import { ModuleController } from './controller'
import { getConnInfo } from 'hono/bun'

const moduleRouter = new Hono()
const controller = new ModuleController()

moduleRouter.get('/', async (c) => {
    const info = getConnInfo(c)
    console.log(`Your remote address is ${info.remote.address}`)
    const data = await controller.getAll()
    return data
})

moduleRouter.get('/:id', async (c) => {
    const id = c.req.param('id')
    const data = await controller.get(id)
    return data
})

moduleRouter.post('/', async (c) => {
    const body = await c.req.json()
    const created = await controller.create(body)
    return created
})

moduleRouter.put('/:id', async (c) => {
    const id = c.req.param('id')
    const body = await c.req.json()
    const updated = await controller.update(body, id)
    return updated
})

moduleRouter.delete('/:id', async (c) => {
  const id = c.req.param('id')
  await controller.delete(id)
  return c.status(204)
})

export default moduleRouter
