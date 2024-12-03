import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCheckInfoNewComponent } from './view-check-info-new.component';

describe('ViewCheckInfoNewComponent', () => {
  let component: ViewCheckInfoNewComponent;
  let fixture: ComponentFixture<ViewCheckInfoNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCheckInfoNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCheckInfoNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
