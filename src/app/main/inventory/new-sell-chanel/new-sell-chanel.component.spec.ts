import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSellChanelComponent } from './new-sell-chanel.component';

describe('NewSellChanelComponent', () => {
  let component: NewSellChanelComponent;
  let fixture: ComponentFixture<NewSellChanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSellChanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSellChanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
