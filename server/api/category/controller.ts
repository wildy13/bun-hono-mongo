import { CategoryService } from "./services";
import { Category } from "../../types/category";

export class CategoryController {
    constructor(private service = new CategoryService()) { }

    async getAll(): Promise<Response> {
        const categories = await this.service.getAll();
        return Response.json(categories);
    }

    async get(id: string): Promise<Response> {
        const category = await this.service.get(id);
        if (!category) return new Response("Category not found", { status: 404 });

        return Response.json(category);
    }

    async create(req: Request): Promise<Response> {
        try {
            type CategoryInput = Partial<Category>;
            const data: CategoryInput = await req as CategoryInput;
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
        type CategoryInput = Partial<Category>;
        const data: CategoryInput = await req as CategoryInput;

        const updatedCategory = await this.service.update(id, data);
        if (!updatedCategory) {
            return new Response("Category not found", { status: 404 });
        }
        return Response.json(updatedCategory);
    }

    async delete(id: string): Promise<Response> {
        const deleted = await this.service.delete(id);
        if (!deleted) {
            return new Response("Category not found", { status: 404 });
        }

        return Response.json(id)
    }
}