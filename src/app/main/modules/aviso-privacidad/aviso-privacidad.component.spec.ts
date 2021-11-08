import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoPrivasidadComponent } from './aviso-privacidad.component';

describe('AvisoPrivasidadComponent', () => {
  let component: AvisoPrivasidadComponent;
  let fixture: ComponentFixture<AvisoPrivasidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvisoPrivasidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvisoPrivasidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
