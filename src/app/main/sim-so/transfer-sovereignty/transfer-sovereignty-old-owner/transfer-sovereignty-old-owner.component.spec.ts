import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSovereigntyOldOwnerComponent } from './transfer-sovereignty-old-owner.component';

describe('TransferSovereigntyOldOwnerComponent', () => {
  let component: TransferSovereigntyOldOwnerComponent;
  let fixture: ComponentFixture<TransferSovereigntyOldOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferSovereigntyOldOwnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferSovereigntyOldOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
