import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileImagePdfComponent } from './upload-file-image-pdf.component';

describe('UploadFileImagePdfComponent', () => {
  let component: UploadFileImagePdfComponent;
  let fixture: ComponentFixture<UploadFileImagePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFileImagePdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileImagePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
