import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanwiseAnalysisComponent } from './salesmanwise-analysis.component';

describe('SalesmanwiseAnalysisComponent', () => {
  let component: SalesmanwiseAnalysisComponent;
  let fixture: ComponentFixture<SalesmanwiseAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesmanwiseAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmanwiseAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
