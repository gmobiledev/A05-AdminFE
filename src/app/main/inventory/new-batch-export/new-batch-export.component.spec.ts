import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBatchExportComponent } from './new-batch-export.component';

describe('NewBatchExportComponent', () => {
  let component: NewBatchExportComponent;
  let fixture: ComponentFixture<NewBatchExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBatchExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBatchExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
