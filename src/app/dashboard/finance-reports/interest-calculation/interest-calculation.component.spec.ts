import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestCalculationComponent } from './interest-calculation.component';

describe('InterestCalculationComponent', () => {
  let component: InterestCalculationComponent;
  let fixture: ComponentFixture<InterestCalculationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestCalculationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
