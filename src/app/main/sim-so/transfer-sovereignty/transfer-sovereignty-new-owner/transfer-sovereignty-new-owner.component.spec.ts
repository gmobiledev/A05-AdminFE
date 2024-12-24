import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSovereigntyNewOwnerComponent } from './transfer-sovereignty-new-owner.component';

describe('TransferSovereigntyNewOwnerComponent', () => {
  let component: TransferSovereigntyNewOwnerComponent;
  let fixture: ComponentFixture<TransferSovereigntyNewOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferSovereigntyNewOwnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferSovereigntyNewOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
