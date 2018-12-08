import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcmInvoiceComponent } from './rcm-invoice.component';

describe('RcmInvoiceComponent', () => {
  let component: RcmInvoiceComponent;
  let fixture: ComponentFixture<RcmInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcmInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcmInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
