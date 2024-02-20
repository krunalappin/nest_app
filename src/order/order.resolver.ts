import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { OrderService } from "./order.service";
import { Order } from "./model/order.model";
import { CreateOrderDto } from "./dto/create-order.dto";
import { GraphqlOrderDto } from "./dto/graphql-order.dto";

@Resolver('Order')
export class OrderResolver {

    constructor(private readonly orderService:OrderService){}

    @Query( () => [Order] )
    async getAllOrders() : Promise<Order[]> {
        const order = await this.orderService.graphqlGetAllOrder();
        return order
    }

    @Query( () => Order )
    async getOrderById(@Args('id') id : string) : Promise<Order> {
        const order = await this.orderService.graphqlGetOrderById(id);
        return order
    }

    @Mutation( () => Order )
    async createOrder(@Args('graphqlOrderDto') graphqlOrderDto : GraphqlOrderDto) : Promise<Order> {

        const order = await this.orderService.graphqlCreateOrder(graphqlOrderDto);
        return order;
        
    }
}   