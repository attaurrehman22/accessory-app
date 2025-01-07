import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyListingDetailsComponent } from './my-listing-details.component';

describe('MyListingDetailsComponent', () => {
  let component: MyListingDetailsComponent;
  let fixture: ComponentFixture<MyListingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyListingDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyListingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
