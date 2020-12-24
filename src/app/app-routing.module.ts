import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { ToBuyStonksComponent } from './modules/wallet/to-buy-stonks/to-buy-stonks.component';
import { WalletComponent } from './modules/wallet/wallet.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'wallet',
        component: WalletComponent,
      },
      {
        path: 'buy',
        component: ToBuyStonksComponent,
      },
      {
        path: '',
        redirectTo: '/wallet',
        pathMatch: 'full'
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'wallet',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
