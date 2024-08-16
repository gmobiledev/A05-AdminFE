import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietG59Component } from './chi-tiet-g59.component';

describe('ChiTietG59Component', () => {
  let component: ChiTietG59Component;
  let fixture: ComponentFixture<ChiTietG59Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietG59Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietG59Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
