import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { OrderService } from "./order.service";
import { Order } from "./model/order.model";
import { GraphqlOrderDto } from "./dto/graphql-order.dto";
import { UpdateGraphqlOrderDto } from "./dto/graphql-updateorder.dto";
import { Next, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Resolver('Order')
export class OrderResolver {

    constructor(private readonly orderService: OrderService) { }

    @Query(() => [Order])
    async getAllOrders(): Promise<Order[]> {
            const order = await this.orderService.graphqlGetAllOrder();
            return order
    }

    @Query(() => Order)
    async getOrderById(@Args('id') id: string): Promise<Order> {
        const order = await this.orderService.graphqlGetOrderById(id);
        return order
    }

    @Mutation(() => Order)
    async createOrder(@Args('graphqlOrderDto') graphqlOrderDto: GraphqlOrderDto): Promise<Order> {

        const order = await this.orderService.graphqlCreateOrder(graphqlOrderDto);
        return order;

    }

    @Mutation(() => String)
    async deleteOrder(@Args('id') id: string): Promise<String> {
        const order = await this.orderService.graphqlDeleteOrderById(id);
        return "Order deleted successfully";
    }

    @Mutation(() => Order)
    async updateOrder(@Args('id') id : string , @Args('graphqlOrderDto') graphqlOrderDto:UpdateGraphqlOrderDto) : Promise<Order>{
        return await this.orderService.graphqlUpdateOrder(id,graphqlOrderDto);
    }
}   