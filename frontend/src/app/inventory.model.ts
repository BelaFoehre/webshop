export interface InventoryModel {
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
