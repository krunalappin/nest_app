import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders } from "./entity/order.entity";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { AuthModule } from "src/auth/auth.module";
import { SessionModule } from "src/session/session.module";
import { User } from "src/user/entity/user.entity";
import { Products } from "src/product/entity/product.entity";
import { Categories } from "src/categories/entity/category.entity";
import { OrderResolver } from "./order.resolver";

@Module({
    imports : [
        AuthModule,
        SessionModule,
        TypeOrmModule.forFeature([Orders]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Products]),
        TypeOrmModule.forFeature([Categories]),
    ],
    controllers : [OrderController],
    providers : [OrderService , OrderResolver],
    exports : [OrderService, OrderResolver],
    
})

export class OrderModule {}

