import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { Categories } from "./entity/category.entity";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Controller('categories')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) {}

    @Get()
    async getAllCategorie(): Promise<Categories[]> {
        const categories = await this.categoryService.getAllCat();
        return categories;
    }

    @Post()
    @UsePipes(new ValidationPipe({transform: true}))
    async createCategory(@Body() body : CreateCategoryDto) {
        const {name, description} = body;
        const category = await this.categoryService.createCategory(name, description);
        return category;
    }

    @Get(':id')
    async getCategoryById(@Param('id') id: number) {
        const category = await this.categoryService.getCategoryById(id);
        return category;
    }

    @Delete(':id')
    async deleteCategory(@Param('id') id: number) {
        const result = await this.categoryService.deleteCategory(id);
        return result;
    }

    @Put(':id')
    async updateCategory(@Param('id') id: number, @Body() body: CreateCategoryDto) {
        const result = await this.categoryService.updateCategory(id, body.name, body.description);
        return result
    }
}