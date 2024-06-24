import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProductsTransferComponent } from './search-products-transfer.component';

describe('SearchProductsTransferComponent', () => {
  let component: SearchProductsTransferComponent;
  let fixture: ComponentFixture<SearchProductsTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchProductsTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProductsTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
