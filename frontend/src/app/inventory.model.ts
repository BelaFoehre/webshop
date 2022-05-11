export interface InventoryModel {
  _id?: string
  bezeichnung: string
  brand: string
  category: {
    main: string,
    sub1: string
  }
  price: number,
  availableQty: number
  tags: string[]
}
