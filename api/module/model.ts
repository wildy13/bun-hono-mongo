import mongoose, { Schema } from "mongoose";
import { nanoid } from "nanoid";

const ModuleSchema = new Schema({
    _id: { type: Schema.Types.String, default: () => nanoid(10) },
    number: { type: Schema.Types.String, required: true, unique: true },
    name: { type: Schema.Types.String, required: true, unique: true },
    version: { type: Schema.Types.String, required: true },
    learningObjective: { type: Schema.Types.String, require: true, trim: true },
    zip: { type: Schema.Types.String, required: true },
    image: { type: Schema.Types.String, required: true },
    category: { type: Schema.Types.String, ref: "Categories", required: true }
});

export const ModuleModel = mongoose.model("Modules", ModuleSchema);
