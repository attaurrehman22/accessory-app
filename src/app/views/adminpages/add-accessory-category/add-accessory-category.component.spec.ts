import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccessoryCategoryComponent } from './add-accessory-category.component';

describe('AddAccessoryCategoryComponent', () => {
  let component: AddAccessoryCategoryComponent;
  let fixture: ComponentFixture<AddAccessoryCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAccessoryCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAccessoryCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
