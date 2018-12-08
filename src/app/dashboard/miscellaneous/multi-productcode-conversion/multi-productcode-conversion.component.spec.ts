import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiProductcodeConversionComponent } from './multi-productcode-conversion.component';

describe('MultiProductcodeConversionComponent', () => {
  let component: MultiProductcodeConversionComponent;
  let fixture: ComponentFixture<MultiProductcodeConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiProductcodeConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiProductcodeConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
