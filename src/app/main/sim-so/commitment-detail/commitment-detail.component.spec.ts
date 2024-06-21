import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitmentDetailComponent } from './commitment-detail.component';

describe('CommitmentDetailComponent', () => {
  let component: CommitmentDetailComponent;
  let fixture: ComponentFixture<CommitmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitmentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
