import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

const MEU_PATRIMONIO = 30000;

const MINHA_CARTEIRA = [
  {
    position: 1,
    ticker: 'AAPL',
    value: 131.88,
    quantity: 20,
    total: 2637.6,
    profit: 0.5,
  },
  {
    position: 2,
    ticker: 'IBMB34',
    value: 638.29,
    quantity: 5,
    total: 3191.45,
    profit: 0.3,
  },
  {
    position: 3,
    ticker: 'GOGL35',
    value: 59.09,
    quantity: 100,
    total: 5909.0,
    profit: 0.2,
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

  displayedColumns: string[] = [
    'position',
    'ticker',
    'value',
    'quantity',
    'total',
    'profit',
    'actions',
  ];
  dataSource = MINHA_CARTEIRA;
  estate = MEU_PATRIMONIO;

  constructor(private _formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.stonksFinderForm = this._formBuilder.group({
      ticker: ['', Validators.required],
    });

    this.stonksTraderForm = this._formBuilder.group({
      ticker: ['', Validators.required],
      value: [1, Validators.required],
    });
  }

  toSellStonks(ticker: string) {
    const stonksToBeSold = this.dataSource
      .filter((stonks) => stonks.ticker === ticker)
      .pop();
    this.estate += stonksToBeSold.total;
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
        this.tickerToBuy.currentValue =
          Number(result['Time Series (Daily)'][this.tickerToBuy.lastTimeRefreshed]['4. close']);
      });

    this.http.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=KDHDQ1SL8QJT0ALN`).subscribe((result) => {
      this.tickerToBuy.description = result['Description'];
    });
  }

  getTotalPrice() {
    return (this.stonksTraderForm.get('value').value * this.tickerToBuy.currentValue).toFixed(2)
  }
}
