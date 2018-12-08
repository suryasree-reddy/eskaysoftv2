import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstrThreeComponent } from './gstr-three.component';

describe('GstrThreeComponent', () => {
  let component: GstrThreeComponent;
  let fixture: ComponentFixture<GstrThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstrThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstrThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
