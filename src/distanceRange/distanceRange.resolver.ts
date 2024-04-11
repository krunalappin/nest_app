import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DistanceRangeService } from "./distanceRange.service";
import { DistanceRange } from "./model/distanceRange.model";
import { DistanceRangeDto } from "./dto/distanceRange.dto";
import { UpdateDistanceRangeDto } from "./dto/updatedistanceRange.dto";

@Resolver('DistanceRange')
export class DistanceRangeResolver {
    constructor(
        private readonly distanceRangeService: DistanceRangeService
    ) { }

    @Query(() => [DistanceRange])
    async getAllDistanceRanges(): Promise<DistanceRange[]> {
        return await this.distanceRangeService.getAllDistanceRange();
    }

    @Query(() => DistanceRange)
    async getDistanceRange(@Args('id') id: number): Promise<DistanceRange> {
        return await this.distanceRangeService.getDistanceRangeById(id);
    }

    @Mutation(() => DistanceRange)
    async createDistanceRange(@Args('distanceRangeDto') distanceRangeDto: DistanceRangeDto): Promise<DistanceRange> {
        return await this.distanceRangeService.createDistanceRange(distanceRangeDto);
    }

    @Mutation(() => DistanceRange)
    async updateDistanceRange(@Args('updateDistanceRangeDto') updateDistanceRangeDto: UpdateDistanceRangeDto): Promise<DistanceRange> {
        return await this.distanceRangeService.updateDistanceRange(updateDistanceRangeDto);
    }

    @Mutation(() => String)
    async deleteDistanceRange(@Args('id') id: number): Promise<String> {
        await this.distanceRangeService.deleteDistanceRange(id);
        return 'Deleted successfully';
    }
}