import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductWatchOfTheDayComponent } from './add-product-watch-of-the-day.component';

describe('AddProductWatchOfTheDayComponent', () => {
  let component: AddProductWatchOfTheDayComponent;
  let fixture: ComponentFixture<AddProductWatchOfTheDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductWatchOfTheDayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProductWatchOfTheDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
