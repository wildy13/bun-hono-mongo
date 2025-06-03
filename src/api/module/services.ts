import { ModuleModel } from "./model";
import { Module } from "./types";

export class ModuleService {
    async getAll() {
        return ModuleModel.find().lean();
    }

    async get(id: string) {
        return ModuleModel.findById(id).lean();
    }

    async create(data: Partial<Module>) {
        for (const [key, value] of Object.entries(data)) {
            if (typeof value !== 'string') {
                throw new Error(`Property '${key}' must be a string`);
            }
        }

        const module = new ModuleModel(data);
        return module.save();
    }

    async update(id: string, data: Partial<Module>) {
        return ModuleModel.findByIdAndUpdate(id, data, { new: true }).lean();
    }

    async delete(id: string) {
        const res = await ModuleModel.findByIdAndDelete(id);
        return res !== null;
    }
}