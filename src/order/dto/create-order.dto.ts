import { IsNull } from "typeorm"

export class CreateOrderDto {
    user_id : number
    product_id : string
    quantity : number
}