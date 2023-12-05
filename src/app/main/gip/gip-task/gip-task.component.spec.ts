import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GipTaskComponent } from './gip-task.component';

describe('GipTaskComponent', () => {
  let component: GipTaskComponent;
  let fixture: ComponentFixture<GipTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GipTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GipTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
