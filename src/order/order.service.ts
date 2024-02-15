import { ForbiddenException, Injectable, NotFoundException, Req } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Orders } from "./entity/order.entity";
import { Repository } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { User } from "src/user/entity/user.entity";
import { Products } from "src/product/entity/product.entity";


@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Orders) private readonly orderRepository: Repository<Orders>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Products) private readonly productRepository: Repository<Products>
    ) {}

    async getAllOrder() : Promise<Orders[]> {
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

    async createOrder(body: CreateOrderDto) : Promise<Orders | Object> {
        const {user_id, product_id, quantity} = body;

        const user = await this.userRepository.findOneBy({id : user_id});
        const product = await this.productRepository.findOneBy({id : product_id});

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
            message : 'Order created successfully',
            result
        }
        
    }

    async getOrderById(id: string) : Promise<Orders> {
        const query = `select orders.id , products.product_name,orders.quantity,products.price, products.unit, orders.total_price , u.username ,orders.created_at  from orders
        left join products on orders.product_id = products.id
        left join "user" u on orders.user_id = u."id"
         WHERE orders.id = '${id}'`;
        const order = await this.orderRepository.query(query);
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }
}
