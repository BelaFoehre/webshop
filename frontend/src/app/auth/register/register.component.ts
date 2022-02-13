import { Component } from '@angular/core';
import { NbAuthResult, NbRegisterComponent } from '@nebular/auth';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
})
export class NgxRegisterComponent extends NbRegisterComponent {
  override register(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service.register(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

      if (this.user.password != this.user.confirmPassword){
        this.errors = ['Passwörter stimmen nicht überein']
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }
}
