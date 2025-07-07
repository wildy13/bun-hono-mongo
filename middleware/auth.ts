import { Context, Next } from 'hono'
import { sign, verify as verifyJwt } from 'hono/jwt'
import { UserModel } from '../api/users/model'
import { JwtPayload } from '../types/jwt.t'

const secret = process.env.SECRET
if (!secret) throw new Error('SECRET environment variable is not defined')

export const login = async (c: Context) => {
    const { username, password } = await c.req.json()

    if (!username || !password) {
        return c.json({ error: 'Username and password required' }, 400)
    }

    const user = await UserModel.findOne({ username })

    if (!user) {
        return c.json({ error: 'Invalid credentials' }, 401)
    }

    const isMatch = await Bun.password.verify(password, user.password)
    if (!isMatch) {
        return c.json({ error: 'Invalid credentials' }, 401)
    }

    const payload: JwtPayload = {
        sub: user._id,
        username: user.username,
        role: 'user',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // 8 hours
    }

    const token = await sign(payload, secret)
    return c.json({ token })
}

export const authMiddleware = async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized: No token provided' }, 401)
    }

    const token = authHeader.split(' ')[1]
    try {
        const payload = await verifyJwt(token, secret) as JwtPayload
        c.set('user', payload)
        await next()
    } catch (err) {
        return c.json({ error: 'Unauthorized: Invalid token' }, 401)
    }
}
