import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCustomerInformationComponent } from './new-customer-information.component';

describe('NewCustomerInformationComponent', () => {
  let component: NewCustomerInformationComponent;
  let fixture: ComponentFixture<NewCustomerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCustomerInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCustomerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
