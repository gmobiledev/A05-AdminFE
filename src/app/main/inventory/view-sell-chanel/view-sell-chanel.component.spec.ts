import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSellChanelComponent } from './view-sell-chanel.component';

describe('ViewSellChanelComponent', () => {
  let component: ViewSellChanelComponent;
  let fixture: ComponentFixture<ViewSellChanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSellChanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSellChanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
