import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryImagesListingComponent } from './accessory-images-listing.component';

describe('AccessoryImagesListingComponent', () => {
  let component: AccessoryImagesListingComponent;
  let fixture: ComponentFixture<AccessoryImagesListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessoryImagesListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessoryImagesListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
