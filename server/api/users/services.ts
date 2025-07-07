import { UserModel } from "./model";
import type { User } from "../../types/user";
import { JwtPayload } from "../../types/jwt.t";

export class UserServices {
    async getAll() {
        return UserModel.find().lean();
    }

    async get(id: string) {
        return UserModel.findById(id).lean();
    }

    async getMe(data: Partial<JwtPayload>) {
        const existingUser = await UserModel.findOne({ username: data.username })
        if (!data) throw new Error('User not required');
        const user = { id: existingUser?._id, username: existingUser?.username }
        return user;
    }

    async create(data: Partial<User>) {
        const existingUser = await UserModel.findOne({ username: data.username })

        if (!data.username || !data.password) throw new Error('Username and password are required');

        if (existingUser) throw new Error('Username already taken')

        const hashed = await Bun.password.hash(data.password, {
            algorithm: "bcrypt",
            cost: 4,
        });
        const newUser = await UserModel.create({
            username: data.username,
            password: hashed
        });

        return newUser;
    }

    async update(id: string, input: Partial<{ username: string, oldPassword: string, newPassword: string }>) {
        const user = await UserModel.findById(id);

        if (!user) throw new Error("user Not Found");
        if (!input.username || !input.oldPassword || !input.newPassword) throw new Error('Username and password are required');

        const isMatch = await Bun.password.verify(input.oldPassword, user.password);
        if (!isMatch) throw new Error('Old password is incorrect');

        const hashed = await Bun.password.hash(input.newPassword, {
            algorithm: "bcrypt",
            cost: 4,
        });
        user.password = hashed;
        await user.save();

        return user;
    }

    async delete(id: string) {
        const res = await UserModel.findByIdAndDelete(id);
        return res !== null;
    }
}