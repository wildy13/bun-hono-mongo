import { Hono } from 'hono'
import { login } from '../../middleware/auth'


const router = new Hono()

router.post('/', async (c) => {
  return await login(c)
})


export default router;