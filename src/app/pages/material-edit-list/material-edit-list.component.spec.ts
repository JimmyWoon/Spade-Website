import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEditListComponent } from './material-edit-list.component';

describe('MaterialEditListComponent', () => {
  let component: MaterialEditListComponent;
  let fixture: ComponentFixture<MaterialEditListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialEditListComponent]
    });
    fixture = TestBed.createComponent(MaterialEditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
