import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldDocumentInformationComponent } from './old-document-information.component';

describe('OldDocumentInformationComponent', () => {
  let component: OldDocumentInformationComponent;
  let fixture: ComponentFixture<OldDocumentInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldDocumentInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldDocumentInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
