import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPurchaseRegisterComponent } from './order-purchase-register.component';

describe('OrderPurchaseRegisterComponent', () => {
  let component: OrderPurchaseRegisterComponent;
  let fixture: ComponentFixture<OrderPurchaseRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPurchaseRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPurchaseRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
