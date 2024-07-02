import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCommitmentComponent } from './search-commitment.component';

describe('SearchCommitmentComponent', () => {
  let component: SearchCommitmentComponent;
  let fixture: ComponentFixture<SearchCommitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchCommitmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCommitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
