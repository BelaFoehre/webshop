import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-edit-order-status',
  templateUrl: './edit-order-status.component.html',
  styleUrls: ['./edit-order-status.component.scss']
})
export class EditOrderStatusComponent {

  orderId!: string
  status_neu!: string
  status!: string

/**
 * The constructor function is used to inject the NbDialogRef service and the OrderService service into
 * the component
 * @param dialogRef - NbDialogRef<EditOrderStatusComponent> - This is the reference to the dialog.
 * @param {OrderService} orderService - This is the service that we created earlier.
 */
  constructor(private dialogRef: NbDialogRef<EditOrderStatusComponent>, private orderService: OrderService) { }

/**
 * It takes the form data, sends it to the backend, and if the backend returns a status code of 200, it
 * closes the dialog
 * @param {NgForm} form - NgForm - this is the form that we created in the HTML file.
 */
  changeOrderStatus(form: NgForm){
    if(form.valid){
      this.orderService.editOrderStatus(this.orderId, this.status_neu).subscribe((res) => {

        if(res.status == 200){
          this.dialogRef.close()
        }
      })
    }
  }
}
