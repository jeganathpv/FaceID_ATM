import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtmFlowComponent } from './atm-flow.component';

describe('AtmFlowComponent', () => {
  let component: AtmFlowComponent;
  let fixture: ComponentFixture<AtmFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtmFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtmFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
