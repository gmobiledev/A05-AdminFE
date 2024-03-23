import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBatchProductsComponent } from './list-batch-products.component';

describe('ListBatchProductsComponent', () => {
  let component: ListBatchProductsComponent;
  let fixture: ComponentFixture<ListBatchProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBatchProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBatchProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
