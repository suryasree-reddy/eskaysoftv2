import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleIssuesComponent } from './article-issues.component';

describe('ArticleIssuesComponent', () => {
  let component: ArticleIssuesComponent;
  let fixture: ComponentFixture<ArticleIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
