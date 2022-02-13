import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent, NbLogoutComponent, NbRequestPasswordComponent, NbResetPasswordComponent } from '@nebular/auth';
import { NgxLoginComponent } from './login/login.component';
import { NgxRegisterComponent } from './register/register.component';

export const routes: Routes = [
  {
      path: '',
      component: NbAuthComponent,
      children: [
        {
          path: '',
          redirectTo: '/auth/login',
          pathMatch: 'full'
        },
        {
          path: 'login',
          component: NgxLoginComponent,
        },
        {
          path: 'register',
          component: NgxRegisterComponent,
        },
        {
          path: 'logout',
          component: NbLogoutComponent,
        },
        {
          path: 'request-password',
          component: NbRequestPasswordComponent,
        },
        {
          path: 'reset-password',
          component: NbResetPasswordComponent,
        },
      ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}
