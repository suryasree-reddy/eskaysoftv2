import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppissuedCreditentryComponent } from './suppissued-creditentry.component';

describe('SuppissuedCreditentryComponent', () => {
  let component: SuppissuedCreditentryComponent;
  let fixture: ComponentFixture<SuppissuedCreditentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppissuedCreditentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppissuedCreditentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
