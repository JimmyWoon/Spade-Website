import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingMaterialComponent } from './teaching-material.component';

describe('TeachingMaterialComponent', () => {
  let component: TeachingMaterialComponent;
  let fixture: ComponentFixture<TeachingMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeachingMaterialComponent]
    });
    fixture = TestBed.createComponent(TeachingMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
