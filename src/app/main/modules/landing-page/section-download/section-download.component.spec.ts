import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionDownloadComponent } from './section-download.component';

describe('SectionDownloadComponent', () => {
  let component: SectionDownloadComponent;
  let fixture: ComponentFixture<SectionDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
