import { Field, InputType } from "@nestjs/graphql";
import { DistanceRangeDto } from "./distanceRange.dto";

@InputType()
export class UpdateDistanceRangeDto extends DistanceRangeDto {

    @Field()
    id: number;
}