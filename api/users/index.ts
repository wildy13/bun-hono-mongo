import { Context, Hono } from 'hono'
import { UserController } from './controller'
import { getConnInfo } from 'hono/bun'
import { authMiddleware } from '../../middleware/auth'

const userRouter = new Hono()
userRouter.use(authMiddleware)

const controller = new UserController()

userRouter.get('/', async (c) => {
    const info = getConnInfo(c)
    const data = await controller.getAll()
    return data
})

userRouter.get('/:id', async (c) => {
    const id = c.req.param('id')
    const data = await controller.get(id)
    return data
})

userRouter.post('/', async (c) => {
    const body = await c.req.json()
    const created = await controller.create(body)
    return created
})

userRouter.put('/:id', async (c) => {
    const id = c.req.param('id')
    const body = await c.req.json()
    const updated = await controller.update(body, id)
    return updated
})

userRouter.delete('/:id', async (c) => {
    const id = c.req.param('id')
    const response = await controller.delete(id)
    return response;
}) 

userRouter.get('/session/', async (c) => {
    const user = c.get('user')
    const response = await controller.getMe(user);
    return response;
})


export default userRouter
