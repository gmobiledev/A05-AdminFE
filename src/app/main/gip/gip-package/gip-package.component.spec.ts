import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GipPackageComponent } from './gip-package.component';

describe('GipPackageComponent', () => {
  let component: GipPackageComponent;
  let fixture: ComponentFixture<GipPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GipPackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GipPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
