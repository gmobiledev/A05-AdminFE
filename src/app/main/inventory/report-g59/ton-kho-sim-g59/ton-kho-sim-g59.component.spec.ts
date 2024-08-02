import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TonKhoSimG59Component } from './ton-kho-sim-g59.component';

describe('TonKhoSimG59Component', () => {
  let component: TonKhoSimG59Component;
  let fixture: ComponentFixture<TonKhoSimG59Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TonKhoSimG59Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TonKhoSimG59Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
