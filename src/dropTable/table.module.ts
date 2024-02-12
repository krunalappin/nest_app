import { Module } from "@nestjs/common";
import { DropTableController } from "./drop-table.controller";

@Module({
    imports : [],
    controllers : [DropTableController],
    providers : [],
    exports : []
})
export class TableModule{}