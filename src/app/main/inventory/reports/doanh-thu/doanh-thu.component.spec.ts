import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoanhThuComponent } from './doanh-thu.component';

describe('DoanhThuComponent', () => {
  let component: DoanhThuComponent;
  let fixture: ComponentFixture<DoanhThuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoanhThuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoanhThuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
