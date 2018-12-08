import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponIssuesRegisterComponent } from './coupon-issues-register.component';

describe('CouponIssuesRegisterComponent', () => {
  let component: CouponIssuesRegisterComponent;
  let fixture: ComponentFixture<CouponIssuesRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponIssuesRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponIssuesRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
