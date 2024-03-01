import { Body, Controller, Get, Param, Post, Req, Request, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { Orders } from "./entity/order.entity";

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        ) {}
        
    @Get('/orders')
    async getAll() : Promise<Orders[]> {
        return await this.orderService.getoredrs();
    }

    @Post() 
    async createOrder(@Body() body: CreateOrderDto) : Promise<Orders | Object> {
        const order = await this.orderService.createOrder(body);
        return order;
    }

    @Get('/category_revenue')
    async categoryRevenue() {
        const order = await this.orderService.categoryRevenue();
        return order;
    }

    @Get('/product_revenew')
    async productRevenue() {
        const order = await this.orderService.productRevenue();
        return order;
    }

    @Get('/category_user')
    async getCategoryWiseUserCount() {
        const order = await this.orderService.getCategoryWiseUserCount();
        return order;
    }

    @Get('/product_user')
    async getProductWiseUserCount() {
        const order = await this.orderService.getProductWiseUserCount();
        return order;
    }

    @Get(':id')
    async getOrderById(@Param('id') id : string) {
        const order = await this.orderService.getOrderById(id);
        return order;
    }
}