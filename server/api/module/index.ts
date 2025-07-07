import { Hono } from 'hono'
import { ModuleController } from './controller'
import { getConnInfo } from 'hono/bun'
import { authMiddleware } from '../../middleware/auth'

const router = new Hono()
const controller = new ModuleController()

router.get('/', async (c) => {
    const info = getConnInfo(c)
    const data = await controller.getAll()
    return data
})

router.get('/:id', async (c) => {
    const id = c.req.param('id')
    const data = await controller.get(id)
    return data;
})

router.post('/', authMiddleware,async (c) => {
    const body = await c.req.json()
    const created = await controller.create(body)
    return created;
})

router.put('/:id', authMiddleware, async (c) => {
    const id = c.req.param('id')
    const body = await c.req.json()
    const updated = await controller.update(body, id)
    return updated
})

router.delete('/:id', authMiddleware, async (c) => {
    const id = c.req.param('id')
    const response = await controller.delete(id)
    return response
})

export default router
