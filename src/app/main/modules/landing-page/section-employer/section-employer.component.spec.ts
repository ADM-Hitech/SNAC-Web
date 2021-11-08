import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionEmployerComponent } from './section-employer.component';

describe('SectionEmployerComponent', () => {
  let component: SectionEmployerComponent;
  let fixture: ComponentFixture<SectionEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
