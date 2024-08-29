import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTopupComponent } from './history-topup.component';

describe('HistoryTopupComponent', () => {
  let component: HistoryTopupComponent;
  let fixture: ComponentFixture<HistoryTopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryTopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryTopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
