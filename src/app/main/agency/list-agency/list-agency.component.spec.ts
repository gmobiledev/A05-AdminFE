import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAgencyComponent } from './list-agency.component';

describe('ListAgencyComponent', () => {
  let component: ListAgencyComponent;
  let fixture: ComponentFixture<ListAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAgencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
