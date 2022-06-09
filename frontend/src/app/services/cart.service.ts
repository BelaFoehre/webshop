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

/**
 * The constructor function is a special function that is called when a new instance of the class is created
 * @param {HttpClient} http - HttpClient - This is the Angular HttpClient that we'll use to make the HTTP requests.
 * @param {NbAuthService} authService - This is the authentication service that we created in the previous step.
 */
  constructor(private http: HttpClient, private authService: NbAuthService) { }

/**
 * It returns an observable that emits a new value every time the productsUpdates subject emits a new
 * value
 * @returns Observable
 */
  getProductsUpdateListener() {
    return this.productsUpdates.asObservable()
  }

/**
 * This function takes in an itemId and a quantity, and then returns an observable of the response from
 * the server
 * @param {string} itemId - The id of the item you want to add to the cart.
 * @param {number} quantity - number - The quantity of the item you want to add to the cart.
 * @returns The response from the server.
 */
  addToCart(itemId: string, quantity: number) {
    let payload = {
      'itemId': itemId,
      'itemQty': quantity
    }
    return this.http.put(`api/purchase/cart?token=${this.getToken()}`, payload);
  }

/**
 * It gets the cart from the server and updates the cart observable
 */
  getCart() {
    this.http.get(`api/purchase/cart?token=${this.getToken()}`,).subscribe((res) => {
      this.cart.next(res)
    });
  }

/**
 * This function returns an observable of the cart with the given cartId
 * @param {string} cartId - The id of the cart you want to retrieve.
 * @returns The cart object
 */
  getCartById(cartId: string) {
    return this.http.get(`api/purchase/cart/${cartId}`);
  }

/**
 * It returns an observable that emits the cart array whenever it is updated
 * @returns The cart.asObservable() is being returned.
 */
  getCartUpdateListener() {
    return this.cart.asObservable()
  }

/**
 * It deletes the cart from the database
 * @returns The response from the server.
 */
  emptyCart() {
    return this.http.delete(`api/purchase/cart?token=${this.getToken()}`);
  }

/**
 * It returns a token, but it doesn't return it until the observable has been subscribed to
 * @returns The token is being returned.
 */
  private getToken(){
    let token;
    this.authService.getToken().subscribe((res: any) => {
      token = res['token']
    })
    return token
  }
}
