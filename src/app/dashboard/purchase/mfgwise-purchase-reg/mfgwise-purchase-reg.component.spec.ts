import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfgwisePurchaseRegComponent } from './mfgwise-purchase-reg.component';

describe('MfgwisePurchaseRegComponent', () => {
  let component: MfgwisePurchaseRegComponent;
  let fixture: ComponentFixture<MfgwisePurchaseRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MfgwisePurchaseRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfgwisePurchaseRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
