interface ItemSchema {
  name: { type: string },
  id: { type: string },
  quantity: { type: Number },
  priceItem: { type: Number },
  priceTotal: { type: Number }
}

export interface CartModel {
  _id?: string
  items: [ItemSchema],
  subTotal: Number,
}
