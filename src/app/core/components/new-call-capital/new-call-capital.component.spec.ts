import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCallCapitalComponent } from './new-call-capital.component';

describe('NewCallCapitalComponent', () => {
  let component: NewCallCapitalComponent;
  let fixture: ComponentFixture<NewCallCapitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCallCapitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCallCapitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
