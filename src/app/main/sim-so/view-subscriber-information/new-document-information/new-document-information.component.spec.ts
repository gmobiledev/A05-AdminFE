import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDocumentInformationComponent } from './new-document-information.component';

describe('NewDocumentInformationComponent', () => {
  let component: NewDocumentInformationComponent;
  let fixture: ComponentFixture<NewDocumentInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDocumentInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDocumentInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
