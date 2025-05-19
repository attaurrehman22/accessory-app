import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryCategoriesComponent } from './accessory-categories.component';

describe('AccessoryCategoriesComponent', () => {
  let component: AccessoryCategoriesComponent;
  let fixture: ComponentFixture<AccessoryCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessoryCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessoryCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
