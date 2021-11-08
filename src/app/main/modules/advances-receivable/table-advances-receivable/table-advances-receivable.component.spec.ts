import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAdvancesReceivableComponent } from './table-advances-receivable.component';

describe('TableAdvancesReceivableComponent', () => {
  let component: TableAdvancesReceivableComponent;
  let fixture: ComponentFixture<TableAdvancesReceivableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableAdvancesReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableAdvancesReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
