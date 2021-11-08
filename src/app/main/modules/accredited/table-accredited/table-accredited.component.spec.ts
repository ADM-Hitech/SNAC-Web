import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAccreditedComponent } from './table-accredited.component';

describe('TableAccreditedComponent', () => {
  let component: TableAccreditedComponent;
  let fixture: ComponentFixture<TableAccreditedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableAccreditedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableAccreditedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
