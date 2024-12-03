import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSovereigntyComponent } from './transfer-sovereignty.component';

describe('TransferSovereigntyComponent', () => {
  let component: TransferSovereigntyComponent;
  let fixture: ComponentFixture<TransferSovereigntyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferSovereigntyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferSovereigntyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
