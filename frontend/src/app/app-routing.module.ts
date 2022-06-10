import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';
import { CartComponent } from './purchase/cart/cart.component';
import { hasRoleGuard } from './services/hasRole-guard.service';
import { StepperComponent } from './purchase/stepper/stepper.component';
import { isLockedGuard } from './services/is-locked.service';
import { OrderOverviewComponent } from './content/order-overview/order-overview.component';
import { EditProfileComponent } from './content/edit-profile/edit-profile.component';

const contentModule = () => import('./content/content.module').then(x => x.ContentModule);
const authModule = () => import('./auth/auth.module').then(x => x.NgxAuthModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);

const routes: Routes = [
  { path: '', redirectTo: '/content', pathMatch: 'full' },
  { path: 'content', loadChildren: contentModule, canActivate: [AuthGuard, isLockedGuard] },
  { path: 'auth', loadChildren: authModule },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard, isLockedGuard] },
  { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard, hasRoleGuard], data: { role: 'Admin' }},
  { path: 'orders', component: OrderOverviewComponent, canActivate: [AuthGuard, isLockedGuard] },
  { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuard, isLockedGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
