import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { Products } from "./entity/product.entity";
import { QueryProductDto } from "./dto/query-product.dto";

@Controller('products')
export class ProductController { 
    constructor(
        private readonly productService: ProductService
    ) {}

    @Get()
    async getAllProducts() {
        const products = await this.productService.getallProducts();
        return products
    }

    @Post()
    async createProduct(@Body() body : CreateProductDto) : Promise<Products> {
        const products = await this.productService.createProducts(body);
        return products;
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id : string) {
        return await this.productService.deleteProduct(id);
    }

    @Put(':id')
    async updateProduct(@Param('id') id : string, @Body() body : CreateProductDto) {
        return await this.productService.updateProduct(id, body);
    }

    @Get('/filter')
    async filterProducts(@Body() body : QueryProductDto) {
        return await this.productService.filterProduct(body);
    }

}
