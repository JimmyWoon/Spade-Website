import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadEditComponent } from './download-edit.component';

describe('DownloadEditComponent', () => {
  let component: DownloadEditComponent;
  let fixture: ComponentFixture<DownloadEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadEditComponent]
    });
    fixture = TestBed.createComponent(DownloadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
