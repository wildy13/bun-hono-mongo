import { Module } from "./module";

export interface Category {
    _id: string;
    name: string;
    modules: Module[]
}