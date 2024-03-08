import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellChanelComponent } from './sell-chanel.component';

describe('SellChanelComponent', () => {
  let component: SellChanelComponent;
  let fixture: ComponentFixture<SellChanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellChanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellChanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
