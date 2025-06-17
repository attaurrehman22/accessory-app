import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttributeInventoryComponent } from './add-attribute-inventory.component';

describe('AddAttributeInventoryComponent', () => {
  let component: AddAttributeInventoryComponent;
  let fixture: ComponentFixture<AddAttributeInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAttributeInventoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAttributeInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
