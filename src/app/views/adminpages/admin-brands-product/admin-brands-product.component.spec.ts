import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBrandsProductComponent } from './admin-brands-product.component';

describe('AdminBrandsProductComponent', () => {
  let component: AdminBrandsProductComponent;
  let fixture: ComponentFixture<AdminBrandsProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBrandsProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminBrandsProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
