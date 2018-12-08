import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailBalanceZoomComponent } from './trail-balance-zoom.component';

describe('TrailBalanceZoomComponent', () => {
  let component: TrailBalanceZoomComponent;
  let fixture: ComponentFixture<TrailBalanceZoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailBalanceZoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailBalanceZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
