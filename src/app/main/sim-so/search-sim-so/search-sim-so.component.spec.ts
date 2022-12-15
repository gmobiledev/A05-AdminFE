import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSimSoComponent } from './search-sim-so.component';

describe('SearchSimSoComponent', () => {
  let component: SearchSimSoComponent;
  let fixture: ComponentFixture<SearchSimSoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSimSoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSimSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
