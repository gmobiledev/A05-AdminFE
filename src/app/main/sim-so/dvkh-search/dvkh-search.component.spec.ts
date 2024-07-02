import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DvkhSearchComponent } from './dvkh-search.component';

describe('DvkhSearchComponent', () => {
  let component: DvkhSearchComponent;
  let fixture: ComponentFixture<DvkhSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DvkhSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DvkhSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
