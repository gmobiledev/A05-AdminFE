import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KinhDoanhG59Component } from './kinh-doanh-g59.component';

describe('KinhDoanhG59Component', () => {
  let component: KinhDoanhG59Component;
  let fixture: ComponentFixture<KinhDoanhG59Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KinhDoanhG59Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KinhDoanhG59Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
