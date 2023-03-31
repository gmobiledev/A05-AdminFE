import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GTaskComponent } from './g-task.component';

describe('GTaskComponent', () => {
  let component: GTaskComponent;
  let fixture: ComponentFixture<GTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
