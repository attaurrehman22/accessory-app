import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccessoryImagesListingComponent } from './add-accessory-images-listing.component';

describe('AddAccessoryImagesListingComponent', () => {
  let component: AddAccessoryImagesListingComponent;
  let fixture: ComponentFixture<AddAccessoryImagesListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAccessoryImagesListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAccessoryImagesListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
