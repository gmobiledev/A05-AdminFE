import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBatchSimComponent } from './list-batch-sim.component';

describe('ListBatchSimComponent', () => {
  let component: ListBatchSimComponent;
  let fixture: ComponentFixture<ListBatchSimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBatchSimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBatchSimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
