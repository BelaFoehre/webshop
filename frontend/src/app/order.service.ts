import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { OrderModel } from './order.model';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersUpdated = new Subject<OrderModel[]>()
  user!: UserModel;

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

  sendInvoice(data: { userId: string, htmlInvoice: string }){
    return this.http
      .post('/api/purchase/order-invoice', data, {observe:'response'})
  }

  getOwnOrders(): Observable<OrderModel[]>{
    return this.http
      .get<OrderModel[]>(`/api/purchase/order?token=${this.getToken()}`)
  }

  private getToken(){
    let token;
    this.authService.getToken().subscribe((res: any) => {
      token = res['token']
    })
    return token
  }

  editOrderStatus(orderId: string, new_status: string) {
    return this.http
      .put(`/api/purchase/order-status/${orderId}`, {status: new_status}, {observe:'response'})
  }
}
