import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalVouchersComponent } from './journal-vouchers.component';

describe('JournalVouchersComponent', () => {
  let component: JournalVouchersComponent;
  let fixture: ComponentFixture<JournalVouchersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalVouchersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
