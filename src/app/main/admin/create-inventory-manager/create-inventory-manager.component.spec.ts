import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInventoryManagerComponent } from './create-inventory-manager.component';

describe('CreateInventoryManagerComponent', () => {
  let component: CreateInventoryManagerComponent;
  let fixture: ComponentFixture<CreateInventoryManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInventoryManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInventoryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
