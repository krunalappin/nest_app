import { ForbiddenException, Injectable, NotFoundException, Req } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Orders } from "./entity/order.entity";
import { Repository } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { User } from "src/user/entity/user.entity";
import { Products } from "src/product/entity/product.entity";
import { Categories } from "src/categories/entity/category.entity";
import { Order } from "./model/order.model";
import { GraphqlOrderDto } from "./dto/graphql-order.dto";
import { UpdateGraphqlOrderDto } from "./dto/graphql-updateorder.dto";


@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Orders) private readonly orderRepository: Repository<Orders>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Products) private readonly productRepository: Repository<Products>,
        @InjectRepository(Categories) private readonly categoryRepository: Repository<Categories>,
    ) { }

    async getAllOrder(): Promise<Orders[]> {
        const query = `select orders.id , products.product_name,orders.quantity,products.price, products.unit, orders.total_price , u.username , orders.created_at  from orders
        left join products on orders.product_id = products.id
        left join "user" u on orders.user_id = u."id"
        `;
        const result = await this.orderRepository.query(query);
        if (!result.length || result.length === 0) {
            return [];
        }
        return result;
    }

    async createOrder(body: CreateOrderDto): Promise<Orders | Object> {
        const { user_id, product_id, quantity } = body;

        const user = await this.userRepository.findOneBy({ id: user_id });
        const product = await this.productRepository.findOneBy({ id: product_id });

        if (!product || !user) {
            throw new NotFoundException('Product or User not found');
        }

        const total_price = product.price * quantity;

        const query = `INSERT INTO orders (user_id, product_id, quantity, total_price) 
        VALUES ('${user_id}', '${product_id}', '${quantity}', '${total_price}')`;

        const result = await this.orderRepository.query(query);
        if (!result) {
            throw new ForbiddenException('Order not created');
        }

        return {
            message: 'Order created successfully',
            result
        }

    }

    async getOrderById(id: string): Promise<Orders> {

        // *******************************************************************************************

        // const query = `select orders.id,products.product_name,orders.quantity,products.price, products.unit, orders.total_price , u.username ,orders.created_at  from orders
        // left join products on orders.product_id = products.id
        // left join "user" u on orders.user_id = u."id"
        // WHERE orders.id = '${id}'`;
        // const orderDetails = await this.orderRepository.query(query);

        // *******************************************************************************************

        const orderDetails = await this.orderRepository
            .createQueryBuilder('orders')
            .leftJoinAndSelect('orders.product', 'product')
            .leftJoinAndSelect('orders.user', 'user')
            .where('orders.id = :id', { id })
            .select([
                'orders.id',
                'product.product_name',
                'orders.quantity',
                'product.price',
                'product.unit',
                'orders.total_price',
                'user.username',
                'orders.created_at',
            ])
            .getOne();

        if (!orderDetails) {
            throw new NotFoundException('Order not found');
        }
        return orderDetails;
    }

    async categoryRevenue(): Promise<Orders[]> {

        // **********************************************************************

        // const query = `select categories.name as category_name , 
        // sum(orders.quantity * products.price) as total_revenue,
        // count(DISTINCT u."id") as user_count
        // from orders
        // left join products on orders.product_id = products.id
        // left join categories on products.category_id = categories.id
        // JOIN "user" u ON orders.user_id = u."id"
        // group by categories.name`

        // const result = await this.orderRepository.query(query);

        // ****************************************************************************

        const result = await this.productRepository
            .createQueryBuilder('product')
            .innerJoin('product.category', 'category')
            .innerJoin('product.order', 'order')
            .innerJoin('order.user', 'user')
            .select([
                'category.name as category_name',
                'SUM(order.quantity * product.price) as total_revenue',
                'COUNT(DISTINCT user.id) as user_count',
            ])
            .groupBy('category.name')
            .getRawMany();

        return result;
    }

    async productRevenue(): Promise<Orders[]> {

        // *********************************************************************************

        // const query = `select products.product_name, 
        // sum(orders.quantity * products.price) as total_revenue, 
        // COUNT(DISTINCT u."id") AS user_count 
        // from orders
        // left join products on orders.product_id = products.id
        // JOIN "user" u ON orders.user_id = u."id"
        // group by products.product_name`;

        // const result = await this.orderRepository.query(query);

        // *********************************************************************************

        const result = await this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.product', 'product')
            .leftJoinAndSelect('order.user', 'user')
            .select([
                'product.product_name',
                'SUM(order.quantity * product.price) as total_revenue',
                'COUNT(DISTINCT user.id) as user_count',
            ])
            .groupBy('product.product_name')
            .getRawMany();

        return result;
    }

    async getCategoryWiseUserCount(): Promise<Orders[]> {

        // ****************************************************************************************

        // const query = `SELECT categories.name AS category_name, COUNT(DISTINCT u."id") AS user_count
        // FROM orders
        // JOIN products ON orders.product_id = products.id
        // JOIN categories ON products.category_id = categories.id
        // JOIN "user" u ON orders.user_id = u."id"
        // GROUP BY categories.name`

        // const result = await this.orderRepository.query(query);

        // ****************************************************************************************

        const result = await this.productRepository
            .createQueryBuilder('product')
            .innerJoin('product.category', 'category')
            .innerJoin('product.order', 'order')
            .innerJoin('order.user', 'user')
            .select([
                'category.name as category_name',
                'COUNT(DISTINCT user.id) as user_count',
            ])
            .groupBy('category.name')
            .getRawMany();

        return result;
    }

    async getProductWiseUserCount(): Promise<Orders[]> {

        // ****************************************************************************************

        // const query = `select products.product_name, COUNT(DISTINCT u."id") AS user_count  from orders
        // left join products on orders.product_id = products.id
        // left join "user" u on orders.user_id = u."id"
        // GROUP BY products.product_name`

        // const result = await this.orderRepository.query(query);

        // ****************************************************************************************

        const result = await this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.product', 'product')
            .leftJoinAndSelect('order.user', 'user')
            .select([
                'product.product_name as product_name',
                'COUNT(DISTINCT user.id) as user_count',
            ])
            .groupBy('product.product_name')
            .getRawMany();

        return result;
    }



    // ************************************************************************GARPHQL*************************************************************************

    async graphqlGetAllOrder(): Promise<Order[]> {
        return this.orderRepository.find( { relations: ['user', 'product'] } );
    }

    async graphqlGetOrderById(id: string): Promise<Order> {
        const order = await this.orderRepository.findOne({ where: { id }, relations: ['user', 'product'] });
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }

    async graphqlCreateOrder(graphqlOrderDto: GraphqlOrderDto): Promise<Order> {

        const user = await this.userRepository.findOne({ where: { id: graphqlOrderDto.user_id } });
        if (!user) {
            throw new NotFoundException('User not found')
        }
        const product = await this.productRepository.findOne({ where: { id: graphqlOrderDto.product_id } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        const totalprice = graphqlOrderDto.quantity * product.price;
        const order = await this.orderRepository.create({...graphqlOrderDto , total_price : totalprice });
        return await this.orderRepository.save(order);

    }

    async graphqlDeleteOrderById(id: string): Promise<string> {

        const result = await this.orderRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Order not found');
        }

        return 'Order deleted successfully';
    }

    async graphqlUpdateOrder(id : string , graphqlOrderDto:UpdateGraphqlOrderDto): Promise<Order>{
        const product = await this.productRepository.findOne({ where: { id: graphqlOrderDto.product_id } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        const user = await this.userRepository.findOne({ where: { id: graphqlOrderDto.user_id } });
        if (!user) {
            throw new NotFoundException('User not found')
        }

        const updatedFields: Partial<Order> = { ...graphqlOrderDto , id};
        await this.productRepository.update({ id }, updatedFields);
        return await this.orderRepository.findOne({ where: { id } , relations: ['user', 'product'] }); 
    }


}
