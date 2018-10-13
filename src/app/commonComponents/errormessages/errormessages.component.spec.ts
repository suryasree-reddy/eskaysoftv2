import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrormessagesComponent } from './errormessages.component';

describe('ErrormessagesComponent', () => {
  let component: ErrormessagesComponent;
  let fixture: ComponentFixture<ErrormessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrormessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrormessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
