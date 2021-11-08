import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionRequirementsComponent } from './section-requirements.component';

describe('SectionRequirementsComponent', () => {
  let component: SectionRequirementsComponent;
  let fixture: ComponentFixture<SectionRequirementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionRequirementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
