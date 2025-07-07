import { ModuleService } from "./services";
import type { Module } from "../../types/module";

export class ModuleController {
    constructor(private service = new ModuleService()) { }

    async getAll(): Promise<Response> {
        const modules = await this.service.getAll();
        return Response.json(modules);
    }

    async get(id: string): Promise<Response> {
        const module = await this.service.get(id);
        if (!module) return new Response("Module not found", { status: 404 });

        return Response.json(module);
    }

    async create(req: Request): Promise<Response> {
        try {
            type ModuleInput = Partial<Module>;
            const data: ModuleInput = await req as ModuleInput;

            const newModel = await this.service.create(data);
            return new Response(JSON.stringify(newModel), { status: 200 });
        } catch (error: any) {
            if (error?.code === 11000) {
                return new Response(
                    JSON.stringify({ message: 'Duplicate entry detected.' }),
                    { status: 409, headers: { 'Content-Type': 'application/json' } }
                );
            }

            return new Response(
                JSON.stringify({ message: 'Failed to create module.', detail: error.message || String(error) }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    async update(req: Request, id: string): Promise<Response> {
        type ModuleInput = Partial<Module>;
        const data: ModuleInput = await req as ModuleInput;

        const updatedModule = await this.service.update(id, data);
        if (!updatedModule) {
            return new Response("Module not found", { status: 404 });
        }
        return Response.json(updatedModule);
    }

    async delete(id: string): Promise<Response> {
        const deleted = await this.service.delete(id);
        if (!deleted) {
            return new Response("Module not found", { status: 404 });
        }

        return Response.json(id)
    }
}