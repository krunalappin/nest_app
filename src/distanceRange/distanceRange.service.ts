import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DistanceRange } from "./entity/distanceRange.entity";
import { Repository } from "typeorm";
import { DistanceRangeDto } from "./dto/distanceRange.dto";
import { UpdateDistanceRangeDto } from "./dto/updatedistanceRange.dto";

@Injectable()
export class DistanceRangeService {
    constructor(
        @InjectRepository(DistanceRange) private readonly distanceRangeRepository: Repository<DistanceRange>,
    ) { }

    async getAllDistanceRange(): Promise<DistanceRange[]> {
        return await this.distanceRangeRepository.find();
    }

    async getDistanceRangeById(id: number): Promise<DistanceRange> {
        return await this.distanceRangeRepository.findOne({
            where: { id },
            order: { id: 'DESC' }
        });
    }

    async createDistanceRange(distanceRangeDto: DistanceRangeDto): Promise<DistanceRange> {
        const maxIdDistanceRange = await this.distanceRangeRepository
            .createQueryBuilder("distanceRange")
            .select("MAX(distanceRange.id)", "maxId")
            .getRawOne();

        let nextId = 1;

        if (maxIdDistanceRange && maxIdDistanceRange.maxId) {
            nextId = parseInt(maxIdDistanceRange.maxId) + 1;
        }
        return await this.distanceRangeRepository.save({ ...distanceRangeDto, id: nextId });
    }

    async updateDistanceRange(updateDistanceRangeDto: UpdateDistanceRangeDto): Promise<DistanceRange> {

        await this.distanceRangeRepository.update(updateDistanceRangeDto.id, { ...updateDistanceRangeDto });
        return await this.getDistanceRangeById(updateDistanceRangeDto.id);
    }

    async deleteDistanceRange(id: number): Promise<String> {

        const distanceRangeToDelete = await this.distanceRangeRepository.delete({ id });
        if (distanceRangeToDelete.affected === 0) {
            throw new NotFoundException('DistanceRange not found');
        }

        const remainingDistanceRanges = await this.distanceRangeRepository.find({ order: { id: 'ASC' } });

        const updatePromises = remainingDistanceRanges.map(async (distanceRange, index) => {
            if (distanceRange.id !== index + 1) {
                await this.distanceRangeRepository.update(distanceRange.id, { id: index + 1 });
            }
        });

        return 'DistanceRange deleted successfully';
    }

}