import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlselectorComponent } from './urlselector.component';

describe('UrlselectorComponent', () => {
  let component: UrlselectorComponent;
  let fixture: ComponentFixture<UrlselectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlselectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
