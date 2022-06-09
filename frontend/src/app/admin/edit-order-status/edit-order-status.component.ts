import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { OrderService } from 'src/app/order.service';

@Component({
  selector: 'app-edit-order-status',
  templateUrl: './edit-order-status.component.html',
  styleUrls: ['./edit-order-status.component.scss']
})
export class EditOrderStatusComponent {

  orderId!: string
  status_neu!: string
  status!: string

  constructor(private dialogRef: NbDialogRef<EditOrderStatusComponent>, private orderService: OrderService) { }

  /**
   * It takes the orderId and new_status from the form, and sends a PUT request to the API to update
   * the order status
   */
  changeOrderStatus(form: NgForm){
    console.log(this.orderId, this.status_neu, this.status)
    if(form.valid){
      this.orderService.editOrderStatus(this.orderId, this.status_neu).subscribe((res) => {

        if(res.status == 200){
          this.dialogRef.close()
        }
      })
    }
  }

}
