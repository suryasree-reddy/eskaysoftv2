import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstrOneComponent } from './gstr-one.component';

describe('GstrOneComponent', () => {
  let component: GstrOneComponent;
  let fixture: ComponentFixture<GstrOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstrOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstrOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
