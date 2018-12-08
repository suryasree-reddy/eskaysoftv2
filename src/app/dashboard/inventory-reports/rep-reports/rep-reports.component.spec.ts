import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepReportsComponent } from './rep-reports.component';

describe('RepReportsComponent', () => {
  let component: RepReportsComponent;
  let fixture: ComponentFixture<RepReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
