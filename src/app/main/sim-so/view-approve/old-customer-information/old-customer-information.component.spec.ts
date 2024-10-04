import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldCustomerInformationComponent } from './old-customer-information.component';

describe('OldCustomerInformationComponent', () => {
  let component: OldCustomerInformationComponent;
  let fixture: ComponentFixture<OldCustomerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldCustomerInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldCustomerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
