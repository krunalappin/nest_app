import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DistanceRangeService } from "./distanceRange.service";
import { DistanceRangeModel } from "./model/distanceRange.model";
import { DistanceRangeDto } from "./dto/distanceRange.dto";
import { UpdateDistanceRangeDto } from "./dto/updatedistanceRange.dto";

@Resolver('DistanceRangeModel')
export class DistanceRangeResolver {
    constructor(
        private readonly distanceRangeService: DistanceRangeService
    ) { }

    @Query(() => [DistanceRangeModel])
    async getAllDistanceRanges(): Promise<DistanceRangeModel[]> {
        return await this.distanceRangeService.getAllDistanceRange();
    }

    @Query(() => DistanceRangeModel)
    async getDistanceRange(@Args('id') id: number): Promise<DistanceRangeModel> {
        return await this.distanceRangeService.getDistanceRangeById(id);
    }

    @Mutation(() => DistanceRangeModel)
    async createDistanceRange(@Args('data') data: DistanceRangeDto): Promise<DistanceRangeModel> {
        return await this.distanceRangeService.createDistanceRange(data);
    }

    @Mutation(() => DistanceRangeModel)
    async updateDistanceRange(@Args('data') data: UpdateDistanceRangeDto): Promise<DistanceRangeModel> {
        return await this.distanceRangeService.updateDistanceRange(data);
    }

    @Mutation(() => Boolean)
    async deleteDistanceRange(@Args('id') id: number): Promise<Boolean> {
        return await this.distanceRangeService.deleteDistanceRange(id);
    }
}