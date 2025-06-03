import { ModuleService } from "./services";
import { Module } from "./types";

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
            const data: ModuleInput = await req.json() as ModuleInput;

            const newModel = await this.service.create(data);
            return new Response(JSON.stringify(newModel), { status: 201 });
        } catch (error) {
            return new Response(`${error}`, { status: 400 });
        }
    }

    async update(req: Request, id: string): Promise<Response> {
        type ModuleInput = Partial<Module>;
        const data: ModuleInput = await req.json() as ModuleInput;

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
        return new Response(null, { status: 204 });
    }
}