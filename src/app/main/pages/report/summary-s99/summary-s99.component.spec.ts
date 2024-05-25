import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryS99Component } from './summary-s99.component';

describe('SummaryS99Component', () => {
  let component: SummaryS99Component;
  let fixture: ComponentFixture<SummaryS99Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryS99Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryS99Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
