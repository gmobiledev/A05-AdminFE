import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSellChanelComponent } from './edit-sell-chanel.component';

describe('EditSellChanelComponent', () => {
  let component: EditSellChanelComponent;
  let fixture: ComponentFixture<EditSellChanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSellChanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSellChanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
