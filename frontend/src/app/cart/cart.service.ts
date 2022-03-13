import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  CART_ID = '622ccb5638d88d84dec34ed2'
  private productsUpdates = new Subject<any[]>()
  private cart = new Subject<any>()
  constructor(private http: HttpClient) { }

  getProductsUpdateListener() {
    return this.productsUpdates.asObservable()
  }
  addToCart(itemId: string, quantity: number) {
    let payload = {
      'itemId': itemId,
      'itemQty': quantity
    }
    return this.http.put(`api/purchase/cart/${this.CART_ID}`, payload);
  }
  getCart() {
    this.http.get(`api/purchase/cart/${this.CART_ID}`).subscribe((res) => {
      this.cart.next(res)
    });
  }

  getCartUpdateListener() {
    return this.cart.asObservable()
  }
  increaseQty(payload: any) {
    return this.http.post(`api/purchase/cart/${this.CART_ID}`, payload);
  }
  emptyCart() {
    return this.http.delete(`api/dev/cart/empty-cart`);
  }
}
