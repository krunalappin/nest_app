import { ObjectType } from "@nestjs/graphql";
import { Column, Entity, IsNull, PrimaryColumn } from "typeorm";

@Entity("distanceRange")
export class DistanceRange {
    @PrimaryColumn()
    id: number;

    @Column()
    from: number;

    @Column()
    to: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' , onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}

