import { UserServices } from "./services";
import type { User } from "../../types/user";
import { JwtPayload } from "../../types/jwt.t";

export class UserController {
    constructor(private service = new UserServices()) { }

    async getAll(): Promise<Response> {
        const users = await this.service.getAll();
        return Response.json(users);
    }

    async get(id: string): Promise<Response> {
        const user = await this.service.get(id);
        if (!user) return new Response("User not found", { status: 404 });

        return Response.json(user);
    }


    async getMe(data: Partial<JwtPayload>): Promise<Response> {
        const user = await this.service.getMe(data);
        if (!user) return new Response("User not found", { status: 404 });

        return Response.json(user);
    }


    async create(req: Request): Promise<Response> {
        try {
            type UserInput = Partial<User>;
            const data: UserInput = await req as UserInput;

            const newUser = await this.service.create(data);

            return new Response(JSON.stringify({
                message: 'User created',
                user: { id: newUser._id, username: newUser.username }
            }), { status: 200 })
        } catch (error) {
            return new Response(`${error}`, { status: 400 });
        }
    }

    async update(req: Request, id: string): Promise<Response> {
        type UserInput = Partial<{ username: string, oldPassword: string, newPassword: string }>;
        const data: UserInput = await req as UserInput;

        const updatedUser = await this.service.update(id, data);
        return Response.json(updatedUser);
    }

    async delete(id: string): Promise<Response> {
        const deleted = await this.service.delete(id);
        if (!deleted) {
            return new Response("User not found", { status: 404 });
        }
        return new Response("Success delete", { status: 200 });
    }
}