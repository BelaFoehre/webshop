import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

/**
 * The constructor function is a default function that runs when the component is loaded
 * @param {AuthService} authService - This is the service that will be used to authenticate the user.
 * @param {UserService} userService - This is the service that will be used to get the user's data from
 * the server.
 * @param {ToastrService} toastr - This is a service that we'll use to display messages to the user.
 */
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
  ) { }

  name!: string
  surname!: string
  email!: string
  userId!: string

/**
 * It gets the user from the local storage and then gets the user from the database
 */
  ngOnInit(): void {
    this.authService.setToken()
    let user: UserModel | null = this.authService.getUser()
    if(user?._id){
      this.userService.getUser(user._id).subscribe((res) => {
        if(res._id){
          this.userId = res._id
          this.name = res.name
          this.surname = res.surname
          this.email = res.email
        } else {
          this.toastr.error("Fehler beim Laden des Benutzers", "Fehler", { timeOut: 2000})
          .onHidden.subscribe(() => {
            window.location.reload()
          })
        }
      })
    } else {
      this.toastr.error("Fehler beim Laden des Benutzers", "Fehler", { timeOut: 2000})
      .onHidden.subscribe(() => {
        window.location.reload()
      })
    }
  }

/* A function that is called when the user clicks on the submit button. It checks if the form is valid
and if it is, it calls the updateUser function from the userService. If the response is 200, it
shows a success message, otherwise it shows an error message. */
  editUser(form: NgForm) {
    if(form.valid){
      this.userService.updateUser(this.userId, this.name, this.surname, this.email).subscribe((res) => {
        if(res.status == 200){
          this.toastr.success('Profil erfolgreich geändert!', 'Erfolg', { timeOut: 2000 })
          .onHidden.subscribe(() => {
            window.location.reload()
          })
        } else {
          this.toastr.error('Profil konnte nicht geändert werden!', 'Fehler', { timeOut: 2000 })
          .onHidden.subscribe(() => {
            window.location.reload()
          })
        }
      })
    }
  }
}
