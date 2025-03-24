import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccessoriesProductComponent } from './create-accessories-product.component';

describe('CreateAccessoriesProductComponent', () => {
  let component: CreateAccessoriesProductComponent;
  let fixture: ComponentFixture<CreateAccessoriesProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccessoriesProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateAccessoriesProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
