import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { HomeComponent } from './modules/home/home.component';
import { ToBuyStonksComponent } from './modules/wallet/to-buy-stonks/to-buy-stonks.component';
import { WalletComponent } from './modules/wallet/wallet.component';

const routes: Routes = [
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
