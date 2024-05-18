import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TonKhoSimComponent } from './ton-kho-sim.component';

describe('TonKhoSimComponent', () => {
  let component: TonKhoSimComponent;
  let fixture: ComponentFixture<TonKhoSimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TonKhoSimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TonKhoSimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
