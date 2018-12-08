import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiareaCustomerConversionComponent } from './multiarea-customer-conversion.component';

describe('MultiareaCustomerConversionComponent', () => {
  let component: MultiareaCustomerConversionComponent;
  let fixture: ComponentFixture<MultiareaCustomerConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiareaCustomerConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiareaCustomerConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
