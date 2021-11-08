import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccreditedComponent } from './accredited.component';

describe('AccreditedComponent', () => {
  let component: AccreditedComponent;
  let fixture: ComponentFixture<AccreditedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccreditedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccreditedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
