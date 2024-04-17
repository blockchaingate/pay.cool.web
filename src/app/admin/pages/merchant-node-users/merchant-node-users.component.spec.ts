import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantNodesComponent } from './merchant-nodes.component';

describe('MerchantNodesComponent', () => {
  let component: MerchantNodesComponent;
  let fixture: ComponentFixture<MerchantNodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantNodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
