import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Category } from './category.model';
import { InventoryModel } from './inventory.model';
import { OrderModel } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private categoriesUpdated = new Subject<NbMenuItem[]>();
  private productsUpdated = new Subject<InventoryModel[]>();
  private ordersUpdated = new Subject<OrderModel[]>();

  constructor(private http: HttpClient, private authService: AuthService){}

  addNewProduct(data: InventoryModel){
    return this.http
      .post<any>('/api/inventory', data, {observe:'response'})
      // .subscribe((res) => {})
  }

  getAllProducts(){
    this.http
      .get<any>('/api/inventory')
      .subscribe((res: InventoryModel) => {
        this.productsUpdated.next([res])
      })
  }

  getAllOrders(){
    this.http
      .get<any>('/api/purchase/order')
      .subscribe((res: OrderModel) => {
        this.ordersUpdated.next([res])
      })
  }

  getProductUpdateListener(){
    return this.productsUpdated.asObservable()
  }

  getOrderUpdateListener(){
    return this.ordersUpdated.asObservable()
  }

  getAllCategories(){
    this.http
      .get<{message: String, data: any}>('/api/kategories')
      .pipe(
        map((result) => {
        return result.data.map((category: Category) => {
          let level2 = category.sub1.map((input) => {
            return {
              title: input,
              /* Anzeige ist Buggy, deswegen pausiert TODO
              children: [
                {
                  title: "test1"
                }
              ]*/
            }
          })
          return {
            title: category.main,
            children: level2
          };
        });
      }))
      .subscribe((res: NbMenuItem) => {
        this.categoriesUpdated.next([res])
      })
  }

  getCategoryUpdateListener() {
    return this.categoriesUpdated.asObservable();
  }

  /**
   * We're using the `put` method to send a request to the server with the product id and quantity of 1
   * @param {String} productId - The id of the product you want to add to the cart.
   */
  addToCart(productId: String) {
    let token = this.getToken()
    this.http
      .put<any>(`/api/purchase/cart?token=${token}`, {itemId: productId, itemQty: 1})
      .subscribe((res) => {
        console.log(res)
      }
      )
  }

  /**
   * It returns a token, but it doesn't return it until the observable has completed
   * @returns The token is being returned.
   */
  private getToken(): String | undefined{
    let token;
    this.authService.getToken().subscribe((res: any) => {
      token = res['token']
    })
    return token
  }
}
