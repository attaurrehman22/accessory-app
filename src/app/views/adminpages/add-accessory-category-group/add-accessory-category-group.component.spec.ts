import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccessoryCategoryGroupComponent } from './add-accessory-category-group.component';

describe('AddAccessoryCategoryGroupComponent', () => {
  let component: AddAccessoryCategoryGroupComponent;
  let fixture: ComponentFixture<AddAccessoryCategoryGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAccessoryCategoryGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAccessoryCategoryGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
