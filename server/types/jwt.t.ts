export type JwtPayload = {
    sub: string
    username: string
    role: 'user' | 'admin' // bisa ditambah jika ada role lain
    exp: number
}
