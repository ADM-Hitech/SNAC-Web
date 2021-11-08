import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableInvestorComponent } from './table-investor.component';

describe('TableInvestorComponent', () => {
  let component: TableInvestorComponent;
  let fixture: ComponentFixture<TableInvestorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableInvestorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableInvestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
