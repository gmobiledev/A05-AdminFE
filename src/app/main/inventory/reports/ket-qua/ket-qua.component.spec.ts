import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KetQuaComponent } from './ket-qua.component';

describe('KetQuaComponent', () => {
  let component: KetQuaComponent;
  let fixture: ComponentFixture<KetQuaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KetQuaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KetQuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
