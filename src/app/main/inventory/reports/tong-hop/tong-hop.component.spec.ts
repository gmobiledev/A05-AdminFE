import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopComponent } from './tong-hop.component';

describe('TongHopComponent', () => {
  let component: TongHopComponent;
  let fixture: ComponentFixture<TongHopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
