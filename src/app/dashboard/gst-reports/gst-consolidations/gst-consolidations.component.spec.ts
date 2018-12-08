import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstConsolidationsComponent } from './gst-consolidations.component';

describe('GstConsolidationsComponent', () => {
  let component: GstConsolidationsComponent;
  let fixture: ComponentFixture<GstConsolidationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstConsolidationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstConsolidationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
