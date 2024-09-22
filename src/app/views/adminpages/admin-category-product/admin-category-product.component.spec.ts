import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoryProductComponent } from './admin-category-product.component';

describe('AdminCategoryProductComponent', () => {
  let component: AdminCategoryProductComponent;
  let fixture: ComponentFixture<AdminCategoryProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategoryProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCategoryProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
