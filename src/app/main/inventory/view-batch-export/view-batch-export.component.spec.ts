import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBatchExportComponent } from './view-batch-export.component';

describe('ViewBatchExportComponent', () => {
  let component: ViewBatchExportComponent;
  let fixture: ComponentFixture<ViewBatchExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBatchExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBatchExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
