import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEsimComponent } from './search-esim.component';

describe('SearchEsimComponent', () => {
  let component: SearchEsimComponent;
  let fixture: ComponentFixture<SearchEsimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchEsimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEsimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
