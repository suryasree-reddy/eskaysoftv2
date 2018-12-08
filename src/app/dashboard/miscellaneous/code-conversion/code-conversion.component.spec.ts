import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeConversionComponent } from './code-conversion.component';

describe('CodeConversionComponent', () => {
  let component: CodeConversionComponent;
  let fixture: ComponentFixture<CodeConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
