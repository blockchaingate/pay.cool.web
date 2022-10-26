import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantNodeAddComponent } from './merchant-node-add.component';

describe('MerchantNodeAddComponent', () => {
  let component: MerchantNodeAddComponent;
  let fixture: ComponentFixture<MerchantNodeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantNodeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantNodeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
