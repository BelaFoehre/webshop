import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const contentModule = () => import('./content/content.module').then(x => x.ContentModule); 

const routes: Routes = [
  { path: '', redirectTo: '/content', pathMatch: 'full' },
  { path: 'content', loadChildren: contentModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
