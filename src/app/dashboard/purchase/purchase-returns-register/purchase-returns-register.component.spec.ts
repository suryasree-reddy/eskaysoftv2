import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReturnsRegisterComponent } from './purchase-returns-register.component';

describe('PurchaseReturnsRegisterComponent', () => {
  let component: PurchaseReturnsRegisterComponent;
  let fixture: ComponentFixture<PurchaseReturnsRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReturnsRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReturnsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
