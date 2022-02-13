import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.service';

const contentModule = () => import('./content/content.module').then(x => x.ContentModule);
const authModule = () => import('./auth/auth.module').then(x => x.NgxAuthModule);

const routes: Routes = [
  { path: '', redirectTo: '/content', pathMatch: 'full' },
  { path: 'content', loadChildren: contentModule, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: authModule }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
