import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstrTwoComponent } from './gstr-two.component';

describe('GstrTwoComponent', () => {
  let component: GstrTwoComponent;
  let fixture: ComponentFixture<GstrTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstrTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstrTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
