import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEditComponent } from './material-edit.component';

describe('MaterialEditComponent', () => {
  let component: MaterialEditComponent;
  let fixture: ComponentFixture<MaterialEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialEditComponent]
    });
    fixture = TestBed.createComponent(MaterialEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
