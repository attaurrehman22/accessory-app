import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttributeListingComponent } from './add-attribute-listing.component';

describe('AddAttributeListingComponent', () => {
  let component: AddAttributeListingComponent;
  let fixture: ComponentFixture<AddAttributeListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAttributeListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAttributeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
