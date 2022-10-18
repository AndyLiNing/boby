import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BobyLibComponent } from './boby-lib.component';

describe('BobyLibComponent', () => {
  let component: BobyLibComponent;
  let fixture: ComponentFixture<BobyLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BobyLibComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BobyLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
