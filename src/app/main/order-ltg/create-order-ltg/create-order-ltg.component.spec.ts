import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderLtgComponent } from './create-order-ltg.component';

describe('CreateOrderLtgComponent', () => {
  let component: CreateOrderLtgComponent;
  let fixture: ComponentFixture<CreateOrderLtgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrderLtgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrderLtgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
