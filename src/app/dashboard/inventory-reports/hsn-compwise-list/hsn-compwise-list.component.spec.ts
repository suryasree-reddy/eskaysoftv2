import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnCompwiseListComponent } from './hsn-compwise-list.component';

describe('HsnCompwiseListComponent', () => {
  let component: HsnCompwiseListComponent;
  let fixture: ComponentFixture<HsnCompwiseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsnCompwiseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsnCompwiseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
