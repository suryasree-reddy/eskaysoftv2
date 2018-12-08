import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalconfirmAccountcopyComponent } from './balconfirm-accountcopy.component';

describe('BalconfirmAccountcopyComponent', () => {
  let component: BalconfirmAccountcopyComponent;
  let fixture: ComponentFixture<BalconfirmAccountcopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalconfirmAccountcopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalconfirmAccountcopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
