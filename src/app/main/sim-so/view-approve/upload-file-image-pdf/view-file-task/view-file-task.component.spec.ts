import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFileTaskComponent } from './view-file-task.component';

describe('ViewFileTaskComponent', () => {
  let component: ViewFileTaskComponent;
  let fixture: ComponentFixture<ViewFileTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFileTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFileTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
