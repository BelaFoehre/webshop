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
  constructor(private http: HttpClient, private authService: NbAuthService) { }

  getProductsUpdateListener() {
    return this.productsUpdates.asObservable()
  }
  addToCart(itemId: string, quantity: number) {
    let payload = {
      'itemId': itemId,
      'itemQty': quantity
    }
    return this.http.put(`api/purchase/cart?token=${this.getToken()}`, payload);
  }
  getCart() {
    this.http.get(`api/purchase/cart?token=${this.getToken()}`,).subscribe((res) => {
      this.cart.next(res)
    });
  }

  getCartById(cartId: string) {
    return this.http.get(`api/purchase/cart/${cartId}`);
  }

  getCartUpdateListener() {
    return this.cart.asObservable()
  }

  emptyCart() {
    return this.http.delete(`api/purchase/cart?token=${this.getToken()}`);
  }

  private getToken(){
    let token;
    this.authService.getToken().subscribe((res: any) => {
      token = res['token']
    })
    return token
  }
}
