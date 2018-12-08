import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAccCopyComponent } from './group-acc-copy.component';

describe('GroupAccCopyComponent', () => {
  let component: GroupAccCopyComponent;
  let fixture: ComponentFixture<GroupAccCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupAccCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAccCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
