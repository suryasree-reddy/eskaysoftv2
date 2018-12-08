import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataIndexingComponent } from './data-indexing.component';

describe('DataIndexingComponent', () => {
  let component: DataIndexingComponent;
  let fixture: ComponentFixture<DataIndexingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataIndexingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataIndexingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
