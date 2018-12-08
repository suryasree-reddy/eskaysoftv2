import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestCalculationDuedaysComponent } from './interest-calculation-duedays.component';

describe('InterestCalculationDuedaysComponent', () => {
  let component: InterestCalculationDuedaysComponent;
  let fixture: ComponentFixture<InterestCalculationDuedaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestCalculationDuedaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestCalculationDuedaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
