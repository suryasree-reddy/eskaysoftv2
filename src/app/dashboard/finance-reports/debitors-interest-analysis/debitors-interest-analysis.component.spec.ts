import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitorsInterestAnalysisComponent } from './debitors-interest-analysis.component';

describe('DebitorsInterestAnalysisComponent', () => {
  let component: DebitorsInterestAnalysisComponent;
  let fixture: ComponentFixture<DebitorsInterestAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitorsInterestAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitorsInterestAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
