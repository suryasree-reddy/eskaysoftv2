import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstRegistersComponent } from './gst-registers.component';

describe('GstRegistersComponent', () => {
  let component: GstRegistersComponent;
  let fixture: ComponentFixture<GstRegistersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstRegistersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstRegistersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
