import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUpdatePriceComponent } from './view-update-price.component';

describe('ViewUpdatePriceComponent', () => {
  let component: ViewUpdatePriceComponent;
  let fixture: ComponentFixture<ViewUpdatePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUpdatePriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUpdatePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
