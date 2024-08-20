import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KetQuaG59Component } from './ket-qua-g59.component';

describe('KetQuaG59Component', () => {
  let component: KetQuaG59Component;
  let fixture: ComponentFixture<KetQuaG59Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KetQuaG59Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KetQuaG59Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
