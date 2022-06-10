import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
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
 * It's a constructor function that injects the dialogRef, orderService, and toastrService
 * @param dialogRef - NbDialogRef<EditOrderStatusComponent> - This is the reference to the dialog.
 * @param {OrderService} orderService - This is the service that we created earlier.
 * @param {ToastrService} toastr - This is the service that we'll use to display messages to the user.
 */
  constructor(
    private dialogRef: NbDialogRef<EditOrderStatusComponent>,
    private orderService: OrderService,
    private toastr: ToastrService
  ) { }

/**
 * It takes the form data, sends it to the backend, and then displays a toastr message depending on the
 * response
 * @param {NgForm} form - NgForm - The form that is used to change the status of the order.
 */
  changeOrderStatus(form: NgForm){
    if(form.valid){
      this.orderService.editOrderStatus(this.orderId, this.status_neu).subscribe((res) => {

        if(res.status == 200){
          this.toastr.success('Status erfolgreich geändert!', 'Erfolg', { timeOut: 2000 })
          .onHidden.subscribe(() => {
            this.dialogRef.close()
          })
        } else {
          this.toastr.error('Status konnte nicht geändert werden!', 'Fehler', { timeOut: 2000 })
          .onHidden.subscribe(() => {
            this.dialogRef.close()
          })
        }
      })
    }
  }
}
