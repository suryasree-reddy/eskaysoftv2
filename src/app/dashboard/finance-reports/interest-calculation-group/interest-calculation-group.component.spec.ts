import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestCalculationGroupComponent } from './interest-calculation-group.component';

describe('InterestCalculationGroupComponent', () => {
  let component: InterestCalculationGroupComponent;
  let fixture: ComponentFixture<InterestCalculationGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestCalculationGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestCalculationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
