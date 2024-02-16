import { Query, Resolver } from "@nestjs/graphql";
import { CategoryService } from "./category.service";
import { Category } from "./model/category.model";

@Resolver('Category')
export class CategoryResolver {
    constructor(
        private readonly categoryService: CategoryService
    ){}

    @Query(() => [Category])
    async getAllCategories(){
        const categories = await this.categoryService.getAllCategories();
        return categories;
    }

}
