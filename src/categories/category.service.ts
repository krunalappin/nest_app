import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Categories } from "./entity/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Categories) private readonly categoryRepository: Repository<Categories>,
    ) { }

    async getAllCat(): Promise<Categories[]> {
        const categories = await this.categoryRepository.query(`SELECT * FROM categories`);
        if (!categories || categories.length === 0) {
            throw new NotFoundException('Categories not found');
        }
        return categories;
    }

    async createCategory(name: string, description: string): Promise<Categories | object> {

        const existingCategory = `SELECT * FROM categories WHERE name = '${name}'`;
        const checkcategory = await this.categoryRepository.query(existingCategory);
        if (checkcategory.length > 0) {
            throw new NotAcceptableException('Category already exists');
        }

        const query = `INSERT INTO categories (name, description) VALUES ('${name}', '${description}')`;
        if (!name || !description) {
            throw new NotAcceptableException('All fields Are required');
        }
        const category = await this.categoryRepository.query(query);
        return { category: checkcategory , message: 'Category created successfully' };
    }

    async deleteCategory(id: number): Promise<object | string> {
        const existingCategoryQuery = `SELECT * FROM categories WHERE id = ${id}`;
        const existingCategory = await this.categoryRepository.query(existingCategoryQuery);

        if (!existingCategory.length) {
            throw new NotAcceptableException('Category does not exist');
        }
        const deleteQuery = `DELETE FROM categories WHERE id = ${id}`;
        await this.categoryRepository.query(deleteQuery);

        return { category: existingCategory, message: 'Category deleted successfully' };
    }

    async updateCategory(id: number, name: string, description: string): Promise<Categories | object> {
        const existingCategoryQuery = `SELECT * FROM categories WHERE id = ${id}`;
        const existingCategory = await this.categoryRepository.query(existingCategoryQuery);
        if (existingCategory.length === 0) {
            throw new NotAcceptableException('Category does not exist');
        }
        const updateQuery = `UPDATE categories SET name = '${name}', description = '${description}' WHERE id = ${id}`;
        if (!name || !description) {
            throw new NotAcceptableException('All fields Are required');
        }
        const updatedCategory = await this.categoryRepository.query(updateQuery);
        return {
            id: updatedCategory.id,
            name: updatedCategory.name,
            description: updatedCategory.description
        }
    }

    async getCategoryById(id: number): Promise<Categories> {
        const query = await this.categoryRepository.findOne({ where: { id } });
        if (!query) {
            throw new NotFoundException('Category not found');
        }
        return query;
    }
}