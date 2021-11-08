import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHowWorkComponent } from './section-how-work.component';

describe('SectionHowWorkComponent', () => {
  let component: SectionHowWorkComponent;
  let fixture: ComponentFixture<SectionHowWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionHowWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionHowWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
