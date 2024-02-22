import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ProductService } from "./product.service";
import { CategoryService } from "src/categories/category.service";
import { Product } from "./model/product.model";
import { GraphqlProductDto } from "./dto/graphql-product.dto";
import { UpdateProductDto } from "./dto/graphql-updateproduct.dto";
import { UseFilters } from "@nestjs/common";
import { HttpExceptionFilter } from "src/utils/http-exception.filter";
import { GqlHttpExceptionFilter } from "src/utils/http-gqlexception.filter";


@Resolver('Product')
export class ProductResolver {
    constructor(
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService
    ) { }

    @Query(() => [Product])
    async products() {
        const products = await this.productService.getAllProduct();
        return products;
    }

    @Query(() => Product)
    async product(@Args('id') id: string): Promise<Product> {
        return await this.productService.getProductById(id);
    }

    @Mutation(() => Product)
    async createProduct(@Args('graphqlProductDto') graphqlProductDto: GraphqlProductDto): Promise<Product> {
        return await this.productService.createProduct(graphqlProductDto);
    }

    @Mutation(() => String)
    async deleteProduct(@Args('id') id: string): Promise<string> {
        await this.productService.deleteProductById(id);
        return 'Product deleted successfully';
    }


    @Mutation(() => Product)
    // @UseFilters(new GqlHttpExceptionFilter())
    async updateProduct(@Args('id', { type: () => ID }) id: string,@Args('graphqlProductDto') graphqlProductDto: UpdateProductDto): Promise<Product> {
        return this.productService.updateProducts(id, graphqlProductDto);
    }

}