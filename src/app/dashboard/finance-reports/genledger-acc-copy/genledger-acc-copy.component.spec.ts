import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenledgerAccCopyComponent } from './genledger-acc-copy.component';

describe('GenledgerAccCopyComponent', () => {
  let component: GenledgerAccCopyComponent;
  let fixture: ComponentFixture<GenledgerAccCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenledgerAccCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenledgerAccCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
