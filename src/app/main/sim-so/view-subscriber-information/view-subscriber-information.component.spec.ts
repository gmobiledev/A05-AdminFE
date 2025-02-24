import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubscriberInformationComponent } from './view-subscriber-information.component';

describe('ViewSubscriberInformationComponent', () => {
  let component: ViewSubscriberInformationComponent;
  let fixture: ComponentFixture<ViewSubscriberInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSubscriberInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubscriberInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
