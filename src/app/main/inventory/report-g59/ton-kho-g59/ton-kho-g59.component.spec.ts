import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TonKhoG59Component } from './ton-kho-g59.component';

describe('TonKhoG59Component', () => {
  let component: TonKhoG59Component;
  let fixture: ComponentFixture<TonKhoG59Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TonKhoG59Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TonKhoG59Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
