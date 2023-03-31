import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GMsisdnComponent } from './g-msisdn.component';

describe('GMsisdnComponent', () => {
  let component: GMsisdnComponent;
  let fixture: ComponentFixture<GMsisdnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GMsisdnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GMsisdnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
