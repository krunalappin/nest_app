import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Products } from "./entity/product.entity";
import { ProductResolver } from "./product.resolver";
import { CategoryModule } from "src/categories/category.module";
import { Categories } from "src/categories/entity/category.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Products]),
        TypeOrmModule.forFeature([Categories]),
        CategoryModule
    ],
    controllers: [ProductController],
    providers: [ProductService , ProductResolver],
    exports: [ProductService , ProductResolver]
})
export class ProductModule { }