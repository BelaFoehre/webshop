import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Category } from '../models/category.model';
import { InventoryModel } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private categoriesUpdated = new Subject<NbMenuItem[]>();
  private productsUpdated = new Subject<InventoryModel[]>();

/**
 * The constructor function is a default function that runs whenever we create a new instance of the service
 * @param {HttpClient} http - HttpClient - This is the Angular HttpClient that we'll use to make the HTTP requests.
 * @param {AuthService} authService - This is the service that we created in the previous section.
 */
  constructor(private http: HttpClient, private authService: AuthService){}

/**
 * This function takes in a data object of type InventoryModel and returns an observable of type any
 * @param {InventoryModel} data - InventoryModel - this is the data that we are sending to the server.
 * @returns The response from the server.
 */
  addNewProduct(data: InventoryModel){
    return this.http
      .post<any>('/api/inventory', data, {observe:'response'})
  }

/**
 * This function takes in an id and data, and then returns an observable of type any
 * @param {String} id - The id of the product you want to update
 * @param {InventoryModel} data - InventoryModel
 * @returns The response from the server.
 */
  updateProduct(id: String, data: InventoryModel){
    return this.http
      .put<any>(`/api/inventory/${id}`, data, {observe:'response'})
  }

/**
 * We're using the `http` service to make a `GET` request to the `/api/inventory` endpoint. We're then
 * subscribing to the response and updating the `productsUpdated` subject with the response
 */
  getAllProducts(){
    this.http
      .get<any>('/api/inventory')
      .subscribe((res: InventoryModel) => {
        this.productsUpdated.next([res])
      })
  }

/**
 * It returns an observable that emits a value whenever the productsUpdated subject emits a value
 * @returns Observable
 */
  getProductUpdateListener(){
    return this.productsUpdated.asObservable()
  }

/**
 * This function takes an id as a parameter, and returns an Observable of type InventoryModel
 * @param {string} id - The id of the product you want to get.
 * @returns Observable<InventoryModel>
 */
  getProduct(id: string): Observable<InventoryModel> {
    return this.http.get<InventoryModel>(`/api/inventory/${id}`)
  }

/**
 * We're getting all the categories from the database, mapping them to a new array, and then
 * subscribing to the result
 */
  getAllCategories(){
    this.http
      .get<{message: String, data: any}>('/api/kategories')
      .pipe(
        map((result) => {
        return result.data.map((category: Category) => {
          let level2 = category.sub1.map((input) => {
            return {
              title: input,
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
  addToCart(productId: String, itemQty: number) {
    let token = this.getToken()
    this.http
      .put<any>(`/api/purchase/cart?token=${token}`, {itemId: productId, itemQty})
      .subscribe((res) => {})
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
