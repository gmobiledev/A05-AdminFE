import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsisdnComponent } from './msisdn.component';

describe('MsisdnComponent', () => {
  let component: MsisdnComponent;
  let fixture: ComponentFixture<MsisdnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsisdnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsisdnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
