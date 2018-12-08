import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenpurchasesGstComponent } from './genpurchases-gst.component';

describe('GenpurchasesGstComponent', () => {
  let component: GenpurchasesGstComponent;
  let fixture: ComponentFixture<GenpurchasesGstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenpurchasesGstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenpurchasesGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
