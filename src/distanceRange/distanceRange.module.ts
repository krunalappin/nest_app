import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DistanceRangeResolver } from "./distanceRange.resolver";
import { DistanceRangeService } from "./distanceRange.service";
import { DistanceRange } from "./entity/distanceRange.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([DistanceRange])
    ],
    controllers: [],
    providers: [DistanceRangeResolver, DistanceRangeService],
    exports: [DistanceRangeResolver, DistanceRangeService]
})
export class DistanceRangeModule { }