import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearEndComponent } from './year-end.component';

describe('YearEndComponent', () => {
  let component: YearEndComponent;
  let fixture: ComponentFixture<YearEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearEndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
