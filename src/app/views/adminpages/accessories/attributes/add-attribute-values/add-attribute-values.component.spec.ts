import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttributeValuesComponent } from './add-attribute-values.component';

describe('AddAttributeValuesComponent', () => {
  let component: AddAttributeValuesComponent;
  let fixture: ComponentFixture<AddAttributeValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAttributeValuesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAttributeValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
