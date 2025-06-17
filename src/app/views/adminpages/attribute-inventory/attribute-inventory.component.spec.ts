import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeInventoryComponent } from './attribute-inventory.component';

describe('AttributeInventoryComponent', () => {
  let component: AttributeInventoryComponent;
  let fixture: ComponentFixture<AttributeInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeInventoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttributeInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
