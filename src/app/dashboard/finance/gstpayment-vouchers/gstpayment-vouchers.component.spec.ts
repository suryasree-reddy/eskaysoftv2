import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstpaymentVouchersComponent } from './gstpayment-vouchers.component';

describe('GstpaymentVouchersComponent', () => {
  let component: GstpaymentVouchersComponent;
  let fixture: ComponentFixture<GstpaymentVouchersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstpaymentVouchersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstpaymentVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
