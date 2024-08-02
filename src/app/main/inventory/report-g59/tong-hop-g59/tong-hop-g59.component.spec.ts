import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopG59Component } from './tong-hop-g59.component';

describe('TongHopG59Component', () => {
  let component: TongHopG59Component;
  let fixture: ComponentFixture<TongHopG59Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopG59Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopG59Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
