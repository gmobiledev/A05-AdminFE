import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoanhThuG59Component } from './doanh-thu-g59.component';

describe('DoanhThuG59Component', () => {
  let component: DoanhThuG59Component;
  let fixture: ComponentFixture<DoanhThuG59Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoanhThuG59Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoanhThuG59Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
