import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GReportComponent } from './g-report.component';

describe('GReportComponent', () => {
  let component: GReportComponent;
  let fixture: ComponentFixture<GReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
