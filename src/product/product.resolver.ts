import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ProductService } from "./product.service";
import { CategoryService } from "src/categories/category.service";
import { Product } from "./model/product.model";
import { Category } from "src/categories/model/category.model";


@Resolver('Product')
export class ProductResolver {
    constructor(
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService
    ){}

    @Query(() => [Product])
    async products(){
        const products = await this.productService.getAllProduct();
        return products;
    }

    @Query(() => Product)
    async product(@Args('id') id: string): Promise<Product> {
        return await this.productService.getProductById(id);
    }

}