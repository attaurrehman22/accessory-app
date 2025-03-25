import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPromotionComponent } from './add-edit-promotion.component';

describe('AddEditPromotionComponent', () => {
  let component: AddEditPromotionComponent;
  let fixture: ComponentFixture<AddEditPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPromotionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
