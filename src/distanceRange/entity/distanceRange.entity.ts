import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "distanceRange" })
export class DistanceRange {
    @PrimaryColumn()
    id : number;

    @Column()
    from : number;

    @Column()
    to : number;
}
