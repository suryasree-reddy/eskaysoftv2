import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePrintComponent } from './schedule-print.component';

describe('SchedulePrintComponent', () => {
  let component: SchedulePrintComponent;
  let fixture: ComponentFixture<SchedulePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
