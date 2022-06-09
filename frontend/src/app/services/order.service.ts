import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { OrderModel } from '../models/order.model';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersUpdated = new Subject<OrderModel[]>()
  user!: UserModel;

/**
 * The constructor function is a default function that runs whenever we create a new instance of the service
 * @param {HttpClient} http - HttpClient - This is the Angular HttpClient that we'll use to make the HTTP requests.
 * @param {AuthService} authService - This is the service that we created in the previous section.
 */
  constructor(private http: HttpClient, private authService: AuthService){}

  /**
   * This function takes in an object of type OrderModel and returns an observable of type OrderModel
   * @param {OrderModel} data - OrderModel - the data that we want to send to the server
   * @returns The response from the server.
   */
  addNewOrder(data: any){
    return this.http
      .post<OrderModel>('/api/purchase/order', data, {observe:'response'})
  }

  /**
   * We're using the http service to make a get request to the api/purchase/order endpoint. We're then
   * subscribing to the response and updating the ordersUpdated subject with the response
   */
  getAllOrders(): void{
    this.http
      .get<OrderModel>('/api/purchase/order-all')
      .subscribe((res: OrderModel) => {
        this.ordersUpdated.next([res])
      })
  }

  /**
   * It returns an observable that emits an array of OrderModel objects
   * @returns An observable of type OrderModel[]
   */
  getOrderUpdateListener(): Observable<OrderModel[]>{
    return this.ordersUpdated.asObservable()
  }

 /**
  * This function sends an invoice to a user
  * @param data - { userId: string, htmlInvoice: string }
  * @returns The response from the server.
  */
  sendInvoice(data: { userId: string, htmlInvoice: string }){
    return this.http
      .post('/api/purchase/order-invoice', data, {observe:'response'})
  }

/**
 * It returns an observable of an array of OrderModel objects
 * @returns An observable of an array of OrderModel objects.
 */
  getOwnOrders(): Observable<OrderModel[]>{
    return this.http
      .get<OrderModel[]>(`/api/purchase/order?token=${this.getToken()}`)
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

/**
 * This function takes in an orderId and a new_status, and then it makes a PUT request to the server,
 * sending the new_status as the body of the request
 * @param {string} orderId - the id of the order you want to edit
 * @param {string} new_status - string
 * @returns The response from the server.
 */
  editOrderStatus(orderId: string, new_status: string) {
    return this.http
      .put(`/api/purchase/order-status/${orderId}`, {status: new_status}, {observe:'response'})
  }
}
