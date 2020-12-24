import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TradeComponent } from '../../trade/trade.component';
import { Subscription } from 'rxjs';

const MEU_PATRIMONIO = 30000;

const MINHA_CARTEIRA = [
  {
    position: 1,
    ticker: 'A',
    quantity: 1,
  },
  {
    position: 2,
    ticker: 'B',
    quantity: 1,
  },
  {
    position: 3,
    ticker: 'C',
    quantity: 1,
  },
];

@Component({
  selector: 'app-to-buy-stonks',
  templateUrl: './to-buy-stonks.component.html',
  styleUrls: ['./to-buy-stonks.component.css'],
})
export class ToBuyStonksComponent implements OnInit {
  isLinear = true;
  stonksFinderForm: FormGroup;
  stonksTraderForm: FormGroup;
  tickerToBuy = {
    ticker: '',
    name: '',
    lastTimeRefreshed: '',
    currentValue: 0,
    description: '',
  };

  displayedColumns: string[] = ['position', 'ticker', 'quantity', 'actions'];
  dataSource = MINHA_CARTEIRA;
  estate = MEU_PATRIMONIO;

  userData = {
    name: '',
    email: '',
    balance: 0,
    stonks: [
      { ticker: '1', quantity: 0 },
      { ticker: '2', quantity: 0 },
      { ticker: '3', quantity: 0 },
    ],
    transactions: [],
  };

  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    if (!history.state.data) {
      this.getUserDetails();
    } else {
      this.userData = history.state.data;
      this.loadDataSource(this.userData);
    }

    this.dataSource = this.userData.stonks.map((stk, index) => {
      return {
        position: index + 1,
        ticker: stk.ticker,
        quantity: stk.quantity,
      };
    });
  }

  getUserDetails() {
    console.log('Pegando dado');
    this.http
      .get('http://localhost:3000/wallet', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .subscribe(
        (result: any) => {
          this.userData = result;
          this.loadDataSource(this.userData);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  loadDataSource(userData) {
    this.dataSource = userData.stonks.map((stk, index) => {
      return {
        position: index + 1,
        ticker: stk.ticker,
        quantity: stk.quantity,
      };
    });
  }

  ngOnInit() {
    this.stonksFinderForm = this._formBuilder.group({
      ticker: ['', Validators.required],
    });

    this.stonksTraderForm = this._formBuilder.group({
      ticker: ['', Validators.required],
      quantity: [1, Validators.required],
    });
  }

  toSellStonks(ticker: string) {
    const stonksToBeSold = this.dataSource
      .filter((stonks) => stonks.ticker === ticker)
      .pop();
    this.dataSource = this.dataSource.filter(
      (stonks) => stonks !== stonksToBeSold
    );
  }

  findTicker() {
    const tickerToSearch = this.stonksFinderForm.get('ticker').value;
    if (tickerToSearch) {
      this.http
        .get(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${tickerToSearch}&apikey=KDHDQ1SL8QJT0ALN`
        )
        .subscribe((result) => {
          const stonks =
            result['bestMatches']
              .filter((element) => element['4. region'] === 'United States')
              .shift() || {};
          this.tickerToBuy = {
            name: stonks['2. name'] || '',
            ticker: stonks['1. symbol'] || '',
            lastTimeRefreshed: '',
            currentValue: 0,
            description: '',
          };
          if (this.tickerToBuy.name !== '') {
            this.findTickerDetails(this.tickerToBuy.ticker);
          }
          console.log(this.tickerToBuy);
        });
    }
  }

  findTickerDetails(ticker: string) {
    this.http
      .get(
        `https://www.alphavantage.co/query?symbol=${ticker}&function=TIME_SERIES_DAILY&apikey=KDHDQ1SL8QJT0ALN`
      )
      .subscribe((result) => {
        this.tickerToBuy.lastTimeRefreshed =
          result['Meta Data']['3. Last Refreshed'];
        this.tickerToBuy.currentValue = Number(
          result['Time Series (Daily)'][this.tickerToBuy.lastTimeRefreshed][
            '4. close'
          ]
        );
      });

    this.http
      .get(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=KDHDQ1SL8QJT0ALN`
      )
      .subscribe((result) => {
        this.tickerToBuy.description = result['Description'];
      });
  }

  getTotalPrice() {
    return (
      this.stonksTraderForm.get('quantity').value *
      this.tickerToBuy.currentValue
    ).toFixed(2);
  }

  buyNewStonk() {
    const payload = {
      ticker: this.tickerToBuy.ticker,
      quantity: this.stonksTraderForm.get('quantity').value,
      price: this.tickerToBuy.currentValue,
    }
    this.http
      .post('http://localhost:3000/trade', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .subscribe(
        (result) => {
          this.router.navigate(['/wallet']);
        },
        (error) => {
          console.log(error);
          if (error.status === 200) {
            this.router.navigate(['/wallet']);
          }
        }
      );
    
  }

  openDialog(ticker): void {
    this.http
      .get(
        `https://www.alphavantage.co/query?symbol=${ticker}&function=TIME_SERIES_DAILY&apikey=KDHDQ1SL8QJT0ALN`
      )
      .subscribe((result) => {
        const lastTimeRefreshed = result['Meta Data']['3. Last Refreshed'];
        const currentValue = Number(
          result['Time Series (Daily)'][lastTimeRefreshed]['4. close']
        );
        const dialogRef = this.dialog.open(TradeComponent, {
          width: '300px',
          data: {
            name: ticker,
            quantity: 1,
            price: currentValue,
            type: 'buy',
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.toTrade(result.name, result.quantity, result.price, result.type);
        });
      });
  }

  toTrade(ticker, quantity, price, type) {
    const payload = {
      ticker: ticker,
      price: price,
      quantity: type === 'buy' ? Number(quantity) : -Number(quantity),
    };
    this.http
      .post('http://localhost:3000/trade', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .subscribe(
        (result) => {
          this.getUserDetails();
        },
        (error) => {
          console.log(error);
          if (error.status === 200) {
            this.getUserDetails();
          }
        }
      );
  }
}
