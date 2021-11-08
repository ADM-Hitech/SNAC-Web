import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FondeoControlComponent } from './fondeo-control.component';

describe('FondeoControlComponent', () => {
  let component: FondeoControlComponent;
  let fixture: ComponentFixture<FondeoControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FondeoControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FondeoControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
