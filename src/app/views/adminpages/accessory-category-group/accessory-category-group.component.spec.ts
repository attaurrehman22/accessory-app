import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryCategoryGroupComponent } from './accessory-category-group.component';

describe('AccessoryCategoryGroupComponent', () => {
  let component: AccessoryCategoryGroupComponent;
  let fixture: ComponentFixture<AccessoryCategoryGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessoryCategoryGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessoryCategoryGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
