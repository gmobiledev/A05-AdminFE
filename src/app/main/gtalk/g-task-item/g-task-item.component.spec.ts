import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GTaskItemComponent } from './g-task-item.component';

describe('GTaskItemComponent', () => {
  let component: GTaskItemComponent;
  let fixture: ComponentFixture<GTaskItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GTaskItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GTaskItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
