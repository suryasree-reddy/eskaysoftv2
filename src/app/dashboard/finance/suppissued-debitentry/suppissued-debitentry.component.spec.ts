import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppissuedDebitentryComponent } from './suppissued-debitentry.component';

describe('SuppissuedDebitentryComponent', () => {
  let component: SuppissuedDebitentryComponent;
  let fixture: ComponentFixture<SuppissuedDebitentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppissuedDebitentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppissuedDebitentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
