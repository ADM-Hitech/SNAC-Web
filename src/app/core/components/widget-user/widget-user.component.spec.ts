import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetUserComponent } from './widget-user.component';

describe('WidgetUserComponent', () => {
  let component: WidgetUserComponent;
  let fixture: ComponentFixture<WidgetUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
