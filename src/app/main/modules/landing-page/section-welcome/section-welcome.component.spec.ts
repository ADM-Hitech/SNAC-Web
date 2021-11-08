import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionWelcomeComponent } from './section-welcome.component';

describe('SectionWelcomeComponent', () => {
  let component: SectionWelcomeComponent;
  let fixture: ComponentFixture<SectionWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionWelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
