import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailTotalSellComponent } from './view-detail-total-sell.component';

describe('ViewDetailTotalSellComponent', () => {
  let component: ViewDetailTotalSellComponent;
  let fixture: ComponentFixture<ViewDetailTotalSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDetailTotalSellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailTotalSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
