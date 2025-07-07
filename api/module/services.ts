// services.ts
import { ModuleModel } from "./model";
import { CategoryModel } from "../category/model";
import type { Module } from "../../types/module";

export class ModuleService {
  async getAll() {
    return ModuleModel.find().populate("category").lean();
  }

  async get(id: string) {
    return ModuleModel.findById(id).populate("category").lean();
  }
  async create(data: Partial<Module>) {
    const category = await CategoryModel.findById(data.category);
    if (!category) {
      throw new Error("Category not found");
    }

    const module = new ModuleModel(data);
    const savedModule = await module.save();

    await CategoryModel.findByIdAndUpdate(data.category, {
      $addToSet: { modules: savedModule._id },
    });

    await savedModule.populate("category");

    return savedModule;
  }


  async update(id: string, data: Partial<Module>) {
    return ModuleModel.findByIdAndUpdate(id, data, { new: true }).populate("category").lean();
  }

  async delete(id: string) {
    const module = await ModuleModel.findByIdAndDelete(id);

    if (module) {
      await CategoryModel.findByIdAndUpdate(module.category, {
        $pull: { modules: module._id },
      });
    }

    return id;
  }
}
