import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdatePriceComponent } from './create-update-price.component';

describe('CreateUpdatePriceComponent', () => {
  let component: CreateUpdatePriceComponent;
  let fixture: ComponentFixture<CreateUpdatePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdatePriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdatePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
