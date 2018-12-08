import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsRecheckingComponent } from './accounts-rechecking.component';

describe('AccountsRecheckingComponent', () => {
  let component: AccountsRecheckingComponent;
  let fixture: ComponentFixture<AccountsRecheckingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsRecheckingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsRecheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
