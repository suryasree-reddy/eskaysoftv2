import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalStockAdjComponent } from './internal-stock-adj.component';

describe('InternalStockAdjComponent', () => {
  let component: InternalStockAdjComponent;
  let fixture: ComponentFixture<InternalStockAdjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalStockAdjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalStockAdjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
