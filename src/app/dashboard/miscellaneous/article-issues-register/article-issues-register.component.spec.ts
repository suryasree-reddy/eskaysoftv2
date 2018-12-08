import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleIssuesRegisterComponent } from './article-issues-register.component';

describe('ArticleIssuesRegisterComponent', () => {
  let component: ArticleIssuesRegisterComponent;
  let fixture: ComponentFixture<ArticleIssuesRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleIssuesRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleIssuesRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
