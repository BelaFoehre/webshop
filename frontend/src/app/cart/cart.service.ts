import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private productsUpdates = new Subject<any[]>()
  private cart = new Subject<any>()
  constructor(private http: HttpClient, private authSerivce: NbAuthService) { }

  getProductsUpdateListener() {
    return this.productsUpdates.asObservable()
  }
  addToCart(itemId: string, quantity: number) {
    let token = this.getToken()
    let payload = {
      'itemId': itemId,
      'itemQty': quantity
    }
    return this.http.put(`api/purchase/cart?token=${token}`, payload);
  }
  getCart() {
    let token = this.getToken()
    this.http.get(`api/purchase/cart?token=${token}`,).subscribe((res) => {
      this.cart.next(res)
    });
  }

  getCartUpdateListener() {
    return this.cart.asObservable()
  }
  // increaseQty(payload: any) {
  //   let token = this.getToken()
  //   return this.http.put(`api/purchase/cart?token=${token}`, payload);
  // }
  emptyCart() {
    return this.http.delete(`api/dev/cart/empty-cart`);
  }

  private getToken(){
    let token;
    this.authSerivce.getToken().subscribe((res: any) => {
      token = res['token']
    })
    return token
  }
}
