import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDetailSubscriptionComponent } from './search-detail-subscription.component';

describe('SearchDetailSubscriptionComponent', () => {
  let component: SearchDetailSubscriptionComponent;
  let fixture: ComponentFixture<SearchDetailSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchDetailSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDetailSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
