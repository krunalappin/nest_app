import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Products } from "./entity/product.entity";
import { Repository, UpdateEvent, UpdateResult } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { QueryProductDto } from "./dto/query-product.dto";
import { Product } from "./model/product.model";
import { GraphqlProductDto } from "./dto/graphql-product.dto";
import { Categories } from "src/categories/entity/category.entity";
import { Category } from "src/categories/model/category.model";
import { UpdateProductDto } from "./dto/graphql-updateproduct.dto";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Products) private readonly productRepository: Repository<Products>,
        @InjectRepository(Categories) private readonly categoryRepository: Repository<Categories>,
    ) { }

    async getallProducts(): Promise<Products[]> {
        const query = `SELECT products.*, categories.name AS category_name FROM products 
                        LEFT JOIN categories ON products.category_id = categories.id`;

        const products = await this.productRepository.query(query);

        if (!products || products.length === 0) {
            throw new NotFoundException('Products Not Availeble');
        }

        return products;
    }

    async createProducts(body: CreateProductDto): Promise<Products> {
        const query = `
                INSERT INTO products (product_name , unit , price , category_id)
                VALUES ('${body.product_name}' , '${body.unit}' , '${body.price}' , '${body.categoryId}');
           `
        const products = await this.productRepository.query(query);
        if (!products) {
            throw new Error('Product not created');
        }

        const find = `SELECT * FROM products WHERE product_name = '${body.product_name}'`;
        const result = await this.productRepository.query(find);
        return result;
    }

    async deleteProduct(id: string): Promise<Products | object> {
        const existquery = `SELECT * FROM products WHERE id = '${id}'`;
        const exist = await this.productRepository.query(existquery);
        if (!exist.length) {
            throw new NotFoundException('Product does not exist');

        }
        const query = `DELETE FROM products WHERE id = '${id}'`;
        const result = await this.productRepository.query(query);

        return {
            exist,
            message: 'Product deleted successfully'
        }
    }

    async updateProduct(id: string, body: CreateProductDto): Promise<Products | object> {
        const existquery = `SELECT * FROM products WHERE id = '${id}'`;
        const exist = await this.productRepository.query(existquery);
        if (!exist.length) {
            throw new NotFoundException('Product does not exist');
        }

        const query = `UPDATE products
        SET product_name = '${body.product_name}' , unit = '${body.unit}' , price = '${body.price}' , category_id = '${body.categoryId}' 
        WHERE id = '${id}'`;
        const result = await this.productRepository.query(query);
        if (!result) {
            throw new ForbiddenException('Product not updated');
        }
        return {

            message: 'Product updated successfully'
        }
    }

    async filterProduct(body: QueryProductDto): Promise<Products[]> {

        const query = `SELECT * FROM products WHERE 
    product_name LIKE '%${body.product_name}%'`;

        const products = await this.productRepository.query(query);
        if (!products.length || products.length === 0) {
            throw new NotFoundException('Product not Available');
        }
        return products;
    }

    async joinProduct(): Promise<Products[]> {
        const query = await this.productRepository.createQueryBuilder('products')
            .leftJoinAndSelect('products.category', 'category')
            .select(['products.*', 'category.name as category_name'])
            .getRawMany();

        return query;
    }

    // ****************************************************************GRAPHQL*******************************************************************

    async getAllProduct(): Promise<Products[]> {
        // const products = await this.productRepository.find();
        // return products;
        return this.productRepository.find({ relations: ['category'] });
    }

    async getProductById(id: string): Promise<Products> {
        const product = await this.productRepository.findOne({ where: { id }, relations: { category: true } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async createProduct(graphqlProductDto: GraphqlProductDto): Promise<Product> {
        const category = await this.categoryRepository.findOne({ where: { id: graphqlProductDto.category_id } });
        if (!category) {
            throw new Error('Category not found');
        }
        const newProduct = this.productRepository.create(graphqlProductDto);
        return this.productRepository.save(newProduct);
    }


    async deleteProductById(id: string): Promise<string> {

        const result = await this.productRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Product not found');
        }

        return 'Product deleted successfully';
    }

    async updateProducts(id: string, graphqlProductDto: UpdateProductDto): Promise<Product> {

        const category = await this.categoryRepository.findOne({ where: { id: graphqlProductDto.category_id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        const productToUpdate = await this.productRepository.findOne({ where: { id }, relations: { category: true } });
        if (!productToUpdate) {
            throw new NotFoundException('Product not found');
        }
        const updatedFields: Partial<Product> = { ...graphqlProductDto , id};
        await this.productRepository.update({ id }, updatedFields);
        return await this.productRepository.findOne({ where: { id } , relations: { category: true } });
    }
}


