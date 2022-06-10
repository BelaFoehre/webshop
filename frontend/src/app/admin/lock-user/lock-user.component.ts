import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-lock-user',
  templateUrl: './lock-user.component.html',
  styleUrls: ['./lock-user.component.scss']
})
export class LockUserComponent implements OnInit {

/**
 * The constructor function is used to inject the NbDialogRef service, the UserService service, and the
 * ToastrService service
 * @param dialogRef - NbDialogRef<LockUserComponent> - This is the reference to the dialog.
 * @param {UserService} userService - This is the service that we created earlier.
 * @param {ToastrService} toastr - This is the service that will be used to display the toast
 * notification.
 */
  constructor(
    private dialogRef: NbDialogRef<LockUserComponent>,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  name!: string
  surname!: string
  email!: string
  lock_msg!: string
  userId!: string

/**
 * We're subscribing to the userService.getUser() function, which returns an observable. We're then
 * using the subscribe() function to subscribe to the observable, and then we're using the arrow
 * function to set the name, surname and email variables to the values returned from the observable
 */
  ngOnInit(): void {
    this.userService.getUser(this.userId).subscribe((res) => {
      this.name = res.name
      this.surname = res.surname
      this.email = res.email
    })
  }

/**
 * It takes the form data, sends it to the user service, and then displays a toastr message depending
 * on the response
 * @param {NgForm} form - NgForm - The form that contains the input fields
 */
  lockUser(form: NgForm) {
    if(form.valid){
      this.userService.lockUser(this.userId, true, this.lock_msg).subscribe((res) => {
        if(res.status == 200){
          this.toastr.success('Nutzer erfolgreich gesperrt!', 'Erfolg', { timeOut: 2000 })
          .onHidden.subscribe(() => {
            this.dialogRef.close()
          })
        } else {
          this.toastr.error('Nutzer konnte nicht gesperrt werden!', 'Fehler', { timeOut: 2000 })
          .onHidden.subscribe(() => {
            this.dialogRef.close()
          })
        }
      })
    }
  }
}
