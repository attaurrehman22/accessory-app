import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessorySubCategoryGroupComponent } from './accessory-sub-category-group.component';

describe('AccessorySubCategoryGroupComponent', () => {
  let component: AccessorySubCategoryGroupComponent;
  let fixture: ComponentFixture<AccessorySubCategoryGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessorySubCategoryGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessorySubCategoryGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
