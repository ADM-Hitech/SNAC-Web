import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionsAndInterestsComponent } from './commissions-and-interests.component';

describe('CommissionsAndInterestsComponent', () => {
  let component: CommissionsAndInterestsComponent;
  let fixture: ComponentFixture<CommissionsAndInterestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionsAndInterestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionsAndInterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
