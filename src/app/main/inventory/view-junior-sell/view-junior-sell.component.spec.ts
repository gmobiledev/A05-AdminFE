import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJuniorSellComponent } from './view-junior-sell.component';

describe('ViewJuniorSellComponent', () => {
  let component: ViewJuniorSellComponent;
  let fixture: ComponentFixture<ViewJuniorSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewJuniorSellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewJuniorSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
