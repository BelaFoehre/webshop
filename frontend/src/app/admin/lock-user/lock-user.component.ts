import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-lock-user',
  templateUrl: './lock-user.component.html',
  styleUrls: ['./lock-user.component.scss']
})
export class LockUserComponent implements OnInit {

/**
 * The constructor function is used to inject the NbDialogRef service and the UserService service into
 * the component.
 * @param dialogRef - NbDialogRef<LockUserComponent> - This is the reference to the dialog.
 * @param {UserService} userService - This is the service that we created earlier.
 */
  constructor(
    private dialogRef: NbDialogRef<LockUserComponent>,
    private userService: UserService
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
 * It takes the form as an argument, checks if the form is valid, and if it is, it calls the lockUser
 * function from the user service, passing in the userId, true, and the lock_msg
 * @param {NgForm} form - NgForm - This is the form that we are using to get the data from the user.
 */
  lockUser(form: NgForm) {
    if(form.valid){
      this.userService.lockUser(this.userId, true, this.lock_msg).subscribe((res) => {
        if(res.status == 200){
          this.dialogRef.close()
        }
      })
    }
  }

}
