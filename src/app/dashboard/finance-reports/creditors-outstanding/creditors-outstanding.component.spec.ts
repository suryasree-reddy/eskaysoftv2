import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditorsOutstandingComponent } from './creditors-outstanding.component';

describe('CreditorsOutstandingComponent', () => {
  let component: CreditorsOutstandingComponent;
  let fixture: ComponentFixture<CreditorsOutstandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditorsOutstandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditorsOutstandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
