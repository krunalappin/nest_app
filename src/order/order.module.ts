import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders } from "./entity/order.entity";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { AuthModule } from "src/auth/auth.module";
import { SessionModule } from "src/session/session.module";
import { UserModule } from "src/user/user.module";
import { User } from "src/user/entity/user.entity";
import { Products } from "src/product/entity/product.entity";

@Module({
    imports : [
        AuthModule,
        SessionModule,
        TypeOrmModule.forFeature([Orders]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Products])
    ],
    controllers : [OrderController],
    providers : [OrderService],
    exports : [OrderService],
    
})

export class OrderModule {}

