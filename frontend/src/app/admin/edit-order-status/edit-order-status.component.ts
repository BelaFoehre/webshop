import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order.service';

@Component({
  selector: 'app-edit-order-status',
  templateUrl: './edit-order-status.component.html',
  styleUrls: ['./edit-order-status.component.scss']
})
export class EditOrderStatusComponent implements OnInit {

  orderId!: string

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
  }

  changeOrderStatus(orderId: string, new_status: string){
    this.orderService.editOrderStatus(orderId, new_status)
  }

}
