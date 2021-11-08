/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DetailsAdvancesAcreditedComponent } from './details-advances-acredited.component';

describe('DetailsAdvancesAcreditedComponent', () => {
  let component: DetailsAdvancesAcreditedComponent;
  let fixture: ComponentFixture<DetailsAdvancesAcreditedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsAdvancesAcreditedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsAdvancesAcreditedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
