import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceChangesComponent } from './balance-changes.component';

describe('BalanceChangesComponent', () => {
  let component: BalanceChangesComponent;
  let fixture: ComponentFixture<BalanceChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceChangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
