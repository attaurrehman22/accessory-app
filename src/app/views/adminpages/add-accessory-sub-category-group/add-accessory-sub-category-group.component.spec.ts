import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccessorySubCategoryGroupComponent } from './add-accessory-sub-category-group.component';

describe('AddAccessorySubCategoryGroupComponent', () => {
  let component: AddAccessorySubCategoryGroupComponent;
  let fixture: ComponentFixture<AddAccessorySubCategoryGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAccessorySubCategoryGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAccessorySubCategoryGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
