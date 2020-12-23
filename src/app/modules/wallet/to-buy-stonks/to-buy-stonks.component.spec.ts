import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToBuyStonksComponent } from './to-buy-stonks.component';

describe('ToBuyStonksComponent', () => {
  let component: ToBuyStonksComponent;
  let fixture: ComponentFixture<ToBuyStonksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToBuyStonksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToBuyStonksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
