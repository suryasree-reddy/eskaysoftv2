import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridNumericEditorComponent } from './grid-numeric-editor.component';

describe('GridNumericEditorComponent', () => {
  let component: GridNumericEditorComponent;
  let fixture: ComponentFixture<GridNumericEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridNumericEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridNumericEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
