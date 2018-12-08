import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseupAccountRegComponent } from './closeup-account-reg.component';

describe('CloseupAccountRegComponent', () => {
  let component: CloseupAccountRegComponent;
  let fixture: ComponentFixture<CloseupAccountRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseupAccountRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseupAccountRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
