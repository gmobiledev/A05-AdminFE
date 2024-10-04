import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRecoverySimComponent } from './search-recovery-sim.component';

describe('SearchRecoverySimComponent', () => {
  let component: SearchRecoverySimComponent;
  let fixture: ComponentFixture<SearchRecoverySimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRecoverySimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRecoverySimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
