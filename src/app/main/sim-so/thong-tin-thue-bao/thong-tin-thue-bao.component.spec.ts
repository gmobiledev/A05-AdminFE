import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinThueBaoComponent } from './thong-tin-thue-bao.component';

describe('ThongTinThueBaoComponent', () => {
  let component: ThongTinThueBaoComponent;
  let fixture: ComponentFixture<ThongTinThueBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinThueBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinThueBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
