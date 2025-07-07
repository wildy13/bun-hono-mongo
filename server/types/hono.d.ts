import 'hono'
import { JwtPayload } from './jwt.t'

declare module 'hono' {
  interface ContextVariableMap {
    user: JwtPayload
  }
}
