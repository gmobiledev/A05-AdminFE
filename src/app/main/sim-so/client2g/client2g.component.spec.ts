/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Client2gComponent } from './client2g.component';

describe('Client2gComponent', () => {
  let component: Client2gComponent;
  let fixture: ComponentFixture<Client2gComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Client2gComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Client2gComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
