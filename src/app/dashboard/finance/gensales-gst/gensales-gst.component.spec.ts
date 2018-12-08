import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GensalesGstComponent } from './gensales-gst.component';

describe('GensalesGstComponent', () => {
  let component: GensalesGstComponent;
  let fixture: ComponentFixture<GensalesGstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GensalesGstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GensalesGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
