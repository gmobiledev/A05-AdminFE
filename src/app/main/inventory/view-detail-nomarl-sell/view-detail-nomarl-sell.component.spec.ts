import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailNomarlSellComponent } from './view-detail-nomarl-sell.component';

describe('ViewDetailNomarlSellComponent', () => {
  let component: ViewDetailNomarlSellComponent;
  let fixture: ComponentFixture<ViewDetailNomarlSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDetailNomarlSellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailNomarlSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
