import mongoose, { Schema } from "mongoose";
import { nanoid } from "nanoid";

const UserSchema = new Schema({
    _id: { type: Schema.Types.String, default: () => nanoid(10) },
    username: { type: Schema.Types.String, required: true, unique: true },
    password: { type: Schema.Types.String, required: true },
});

export const UserModel = mongoose.model("Users", UserSchema);
