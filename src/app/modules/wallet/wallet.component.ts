import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit {
  userData = {
    name: '',
    email: '',
    balance: 0,
    stonks: [
      { ticker: '1', quantity: 0 },
      { ticker: '2', quantity: 0 },
      { ticker: '3', quantity: 0 },
    ],
    transactions: [
      { ticker: '1', quantity: 10, price: 1, total: 10, date: new Date() },
      { ticker: '1', quantity: -10, price: 1, total: 10, date: new Date() },
      { ticker: '2', quantity: 10, price: 1, total: 10, date: new Date() },
      { ticker: '2', quantity: -10, price: 1, total: 10, date: new Date() },
      { ticker: '3', quantity: 10, price: 1, total: 10, date: new Date() },
      { ticker: '3', quantity: -10, price: 1, total: 10, date: new Date() },
    ],
  };

  constructor(private http: HttpClient, private router: Router) {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.http
      .get('https://quiet-scrubland-31153.herokuapp.com/wallet', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .subscribe(
        (result: any) => {
          this.userData = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getTransactions(ticker) {
    return this.userData.transactions.filter(
      (transaction) => transaction.ticker === ticker
    );
  }

  getTransactionType(quantity) {
    return Math.sign(quantity) === 1 ? 'COMPRA' : 'VENDA';
  }
}
