import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveProductComponent } from './active-product.component';

describe('ActiveProductComponent', () => {
  let component: ActiveProductComponent;
  let fixture: ComponentFixture<ActiveProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
