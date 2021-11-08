import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFondeoControlComponent } from './table-fondeo-control.component';

describe('TableFondeoControlComponent', () => {
  let component: TableFondeoControlComponent;
  let fixture: ComponentFixture<TableFondeoControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableFondeoControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFondeoControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
