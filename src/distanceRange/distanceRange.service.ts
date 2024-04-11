import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DistanceRange } from "./entity/distanceRange.entity";
import { Repository } from "typeorm";
import { DistanceRangeDto } from "./dto/distanceRange.dto";
import { UpdateDistanceRangeDto } from "./dto/updatedistanceRange.dto";
import { DistanceRangeModel } from "./model/distanceRange.model";

@Injectable()
export class DistanceRangeService {
    constructor(
        @InjectRepository(DistanceRange) private readonly distanceRangeRepository: Repository<DistanceRange>,
    ) { }

    async getAllDistanceRange(): Promise<DistanceRangeModel[]> {
        return await this.distanceRangeRepository.find();
    }

    async getDistanceRangeById(id: number): Promise<DistanceRangeModel> {
        return await this.distanceRangeRepository.findOne({
            where: { id },
            order: { id: 'ASC' }
        });
    }

    async createDistanceRange(distanceRangeDto: DistanceRangeDto): Promise<DistanceRangeModel> {
        const maxIdDistanceRange = await this.distanceRangeRepository
            .createQueryBuilder("distanceRange")
            .select("MAX(distanceRange.id)", "maxId")
            .getRawOne();
        if (maxIdDistanceRange && maxIdDistanceRange.maxId) {
            distanceRangeDto.id = parseInt(maxIdDistanceRange.maxId) + 1;
        }
        return await this.distanceRangeRepository.save({ ...distanceRangeDto, id: distanceRangeDto.id });
    }

    async updateDistanceRange(updateDistanceRangeDto: UpdateDistanceRangeDto): Promise<DistanceRangeModel> {
        await this.distanceRangeRepository.update(updateDistanceRangeDto.id, { ...updateDistanceRangeDto });
        return await this.getDistanceRangeById(updateDistanceRangeDto.id);
    }


    async deleteDistanceRange(id: number): Promise<Boolean> {
        const findDistanceRange = await this.getDistanceRangeById(id);
        if (!findDistanceRange) {
            throw new NotFoundException('DistanceRange not found');
        }
        await this.distanceRangeRepository.delete({ id });
        let remainingDistanceRanges = await this.distanceRangeRepository.find({ order: { id: 'ASC' } });
        if (remainingDistanceRanges && remainingDistanceRanges.length > 0) {
            for (let i = id - 1; i < remainingDistanceRanges.length; i++) {
                let distanceRange = remainingDistanceRanges[i];
                let newId = i + 1;
                let newFrom = (i === 0) ? 0 : remainingDistanceRanges[i - 1].to;
                await this.distanceRangeRepository.update(distanceRange.id, { id: newId, from: newFrom, updatedAt: new Date() });
            }
        }
        return true;
    }

}