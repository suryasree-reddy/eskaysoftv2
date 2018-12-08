import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanwiseOutstandingComponent } from './salesmanwise-outstanding.component';

describe('SalesmanwiseOutstandingComponent', () => {
  let component: SalesmanwiseOutstandingComponent;
  let fixture: ComponentFixture<SalesmanwiseOutstandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesmanwiseOutstandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmanwiseOutstandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
