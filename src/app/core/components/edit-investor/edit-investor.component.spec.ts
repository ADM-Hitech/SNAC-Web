import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvestorComponent } from './edit-investor.component';

describe('EditInvestorComponent', () => {
  let component: EditInvestorComponent;
  let fixture: ComponentFixture<EditInvestorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInvestorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInvestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
