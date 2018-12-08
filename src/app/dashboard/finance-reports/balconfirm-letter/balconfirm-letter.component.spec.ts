import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalconfirmLetterComponent } from './balconfirm-letter.component';

describe('BalconfirmLetterComponent', () => {
  let component: BalconfirmLetterComponent;
  let fixture: ComponentFixture<BalconfirmLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalconfirmLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalconfirmLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
