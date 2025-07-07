import mongoose, { Schema } from "mongoose";
import { nanoid } from "nanoid";

const CategorySchema = new Schema({
    _id: { type: Schema.Types.String, default: () => nanoid(10) },
    name: { type: Schema.Types.String, required: true, unique: true },
    image: { type: Schema.Types.String, required: true },
    modules: [{ type: Schema.Types.String, ref: "Modules" }]
});

export const CategoryModel = mongoose.model("Categories", CategorySchema);
