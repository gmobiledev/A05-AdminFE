import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WayLockComponent } from './way-lock.component';

describe('WayLockComponent', () => {
  let component: WayLockComponent;
  let fixture: ComponentFixture<WayLockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WayLockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WayLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
