import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Categories } from "./entity/category.entity";
import { CategoryResolver } from "./category.resolver";

@Module({
    imports: [
        TypeOrmModule.forFeature([Categories])
    ],
    controllers: [CategoryController],
    providers: [CategoryService , CategoryResolver],
    exports: [CategoryService , CategoryResolver]
})
export class CategoryModule { }