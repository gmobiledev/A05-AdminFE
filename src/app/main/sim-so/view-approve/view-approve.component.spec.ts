import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApproveComponent } from './view-approve.component';

describe('ViewApproveComponent', () => {
  let component: ViewApproveComponent;
  let fixture: ComponentFixture<ViewApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewApproveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
