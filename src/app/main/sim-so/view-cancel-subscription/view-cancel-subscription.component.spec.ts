import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCancelSubscriptionComponent } from './view-cancel-subscription.component';

describe('ViewCancelSubscriptionComponent', () => {
  let component: ViewCancelSubscriptionComponent;
  let fixture: ComponentFixture<ViewCancelSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCancelSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCancelSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
