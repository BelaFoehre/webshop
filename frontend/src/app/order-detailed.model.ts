import { InventoryModel } from "./inventory.model"

export interface OrderDetailedModel {
  items: [InventoryModel]
  status: String
}
