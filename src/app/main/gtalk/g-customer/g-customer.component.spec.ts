import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GCustomerComponent } from './g-customer.component';

describe('GCustomerComponent', () => {
  let component: GCustomerComponent;
  let fixture: ComponentFixture<GCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
