import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Categories } from "./entity/category.entity";
import { CategoryResolver } from "./category.resolver";
import { Products } from "src/product/entity/product.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Categories]),
        TypeOrmModule.forFeature([Products])
    ],
    controllers: [CategoryController],
    providers: [CategoryService , CategoryResolver],
    exports: [CategoryService , CategoryResolver]
})
export class CategoryModule { }