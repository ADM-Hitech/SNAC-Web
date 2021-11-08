import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancesReceivableComponent } from './advances-receivable.component';

describe('AdvancesReceivableComponent', () => {
  let component: AdvancesReceivableComponent;
  let fixture: ComponentFixture<AdvancesReceivableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancesReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancesReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
