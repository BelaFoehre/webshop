import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbIconModule, NbUserModule, NbCardModule, NbMenuModule, NbContextMenuModule, NbButtonModule, NbInputModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { NbPasswordAuthStrategy, NbAuthModule, NbAuthJWTToken } from '@nebular/auth';
import { AuthGuard } from './auth-guard.service';
import { CartComponent } from './cart/cart.component';
import { FormsModule } from '@angular/forms';
import { AddProductComponent } from './admin/add-product/add-product.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CartComponent,
    AddProductComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbSidebarModule.forRoot(),
    NbIconModule,
    NbButtonModule,
    NbInputModule,
    FormsModule,
    NbUserModule,
    NbCardModule,
    NbContextMenuModule,
    NbMenuModule.forRoot(),
    HttpClientModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',

          token: {
            class: NbAuthJWTToken,
            key: 'token'
          },

          baseEndpoint: '/api/auth',
              login: {
                endpoint: '/login',
                method: 'post'
              },
              register: {
                endpoint: '/register',
                method: 'post'
              },
              logout: {
                endpoint: '',
              },
              requestPass: {
                endpoint: '/forgot-password',
                method: 'put',
              },
              resetPass: {
                endpoint: '/reset-password',
                method: 'put',
              },
        }),
      ],
      forms: {},
    }),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
