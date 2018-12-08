import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitorsOutstandingComponent } from './debitors-outstanding.component';

describe('DebitorsOutstandingComponent', () => {
  let component: DebitorsOutstandingComponent;
  let fixture: ComponentFixture<DebitorsOutstandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitorsOutstandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitorsOutstandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
