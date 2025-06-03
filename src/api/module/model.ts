import mongoose, { Schema } from "mongoose";
import { nanoid } from "nanoid";

const ModuleSchema = new Schema({
    _id: { type: Schema.Types.String, default: () => nanoid(10) },
    number: { type: Schema.Types.String, required: true, unique: true },
    name: { type: Schema.Types.String, required: true, unique: true },
    version: { type: Schema.Types.String, required: true },
    url: { type: Schema.Types.String, required: true },
});

export const ModuleModel = mongoose.model("Modules", ModuleSchema);
