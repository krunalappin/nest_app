import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { Request } from "express";
import { Orders } from "./entity/order.entity";


@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly userService: OrderService
    ) {}
    
    @UseGuards(AuthGuard)
    @Get()
    async getAllOrder() {
        const order = await this.orderService.getAllOrder();
        return order;
    }

    // @UseGuards(AuthGuard)
    @Post() 
    async createOrder(@Body() body: CreateOrderDto) : Promise<Orders | Object> {
        // console.log('req, ',req.user);
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