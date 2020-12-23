import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const ELEMENT_DATA = [
  { position: 1, ticker: 'Hydrogen', value: 1.0079, quantity: 'H', total: 5.00 },
  { position: 2, ticker: 'Helium', value: 4.0026, quantity: 'He', total: 5.00 },
  { position: 3, ticker: 'Lithium', value: 6.941, quantity: 'Li', total: 5.00 },
];

@Component({
  selector: 'app-to-buy-stonks',
  templateUrl: './to-buy-stonks.component.html',
  styleUrls: ['./to-buy-stonks.component.css'],
})
export class ToBuyStonksComponent implements OnInit {
  isLinear = true;
  stonksFinderForm: FormGroup;

  displayedColumns: string[] = ['position', 'ticker', 'value', 'quantity', 'total'];
  dataSource = ELEMENT_DATA;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.stonksFinderForm = this._formBuilder.group({
      ticker: ['', Validators.required],
    });

  }
}
