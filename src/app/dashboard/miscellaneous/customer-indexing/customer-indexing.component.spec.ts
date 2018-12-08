import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerIndexingComponent } from './customer-indexing.component';

describe('CustomerIndexingComponent', () => {
  let component: CustomerIndexingComponent;
  let fixture: ComponentFixture<CustomerIndexingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerIndexingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerIndexingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
