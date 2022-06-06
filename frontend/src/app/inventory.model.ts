export interface InventoryModel {
  _id?: string
  name: string
  brand: string
  category: {
    main: string,
    sub1: string
  },
  description: string
  price: number,
  availableQty: number
  tags: string[],
  imgBase64: string
}
