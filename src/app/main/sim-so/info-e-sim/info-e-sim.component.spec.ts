import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoESimComponent } from './info-e-sim.component';

describe('InfoESimComponent', () => {
  let component: InfoESimComponent;
  let fixture: ComponentFixture<InfoESimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoESimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoESimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
