import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Products } from "./entity/product.entity";
import { ProductResolver } from "./product.resolver";
import { CategoryModule } from "src/categories/category.module";
import { Category } from "src/categories/model/category.model";

@Module({
    imports: [
        TypeOrmModule.forFeature([Products]),
        // TypeOrmModule.forFeature([Category]),
        CategoryModule
    ],
    controllers: [ProductController],
    providers: [ProductService , ProductResolver],
    exports: [ProductService , ProductResolver]
})
export class ProductModule { }