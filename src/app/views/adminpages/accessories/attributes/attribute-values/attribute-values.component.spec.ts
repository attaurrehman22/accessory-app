import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeValuesComponent } from './attribute-values.component';

describe('AttributeValuesComponent', () => {
  let component: AttributeValuesComponent;
  let fixture: ComponentFixture<AttributeValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeValuesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttributeValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
