interface ItemSchema {
  name: { type: string },
  id: { type: string },
  quantity: { type: Number },
  priceItem: { type: Number },
  priceTotal: { type: Number }
}

export interface OrderModel {
  _id?: string
  userId: string,
  status?: string,
  cartItems: ItemSchema[],
  subTotal: number,
}
