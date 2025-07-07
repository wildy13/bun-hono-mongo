import { CategoryModel } from "./model";
import type { Category } from "../../types/category";

export class CategoryService {
    async getAll() {
        return CategoryModel.find().populate("modules").lean();
    }

    async get(id: string) {
        return CategoryModel.findById(id).populate("modules").lean();
    }

    async create(data: Partial<Category>) {        
        console.log(data);
        const category = new CategoryModel(data);
        return category.save();
    }

    async update(id: string, data: Partial<Category>) {
        return CategoryModel.findByIdAndUpdate(id, data, { new: true }).populate("modules").lean();
    }

    async delete(id: string) {
        await CategoryModel.findByIdAndDelete(id);
        return id;
    }
}