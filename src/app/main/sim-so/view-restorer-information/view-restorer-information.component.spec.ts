import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRestorerInformationComponent } from './view-restorer-information.component';

describe('ViewRestorerInformationComponent', () => {
  let component: ViewRestorerInformationComponent;
  let fixture: ComponentFixture<ViewRestorerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRestorerInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRestorerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
