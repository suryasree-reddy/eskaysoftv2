import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponIssuesComponent } from './coupon-issues.component';

describe('CouponIssuesComponent', () => {
  let component: CouponIssuesComponent;
  let fixture: ComponentFixture<CouponIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
