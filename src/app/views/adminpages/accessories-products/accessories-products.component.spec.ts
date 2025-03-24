import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoriesProductsComponent } from './accessories-products.component';

describe('AccessoriesProductsComponent', () => {
  let component: AccessoriesProductsComponent;
  let fixture: ComponentFixture<AccessoriesProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessoriesProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessoriesProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
