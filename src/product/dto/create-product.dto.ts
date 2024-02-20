import { IsInt } from "class-validator";
import { Categories } from "src/categories/entity/category.entity";
import { Unique } from "typeorm";

export class CreateProductDto {
    product_name: string;
    unit: string;
    price: number;
    categoryId: number;
}