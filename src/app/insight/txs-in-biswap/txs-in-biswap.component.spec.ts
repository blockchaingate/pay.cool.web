import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxsInBiswapComponent } from './txs-in-biswap.component';

describe('TxsInBiswapComponent', () => {
  let component: TxsInBiswapComponent;
  let fixture: ComponentFixture<TxsInBiswapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxsInBiswapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxsInBiswapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
