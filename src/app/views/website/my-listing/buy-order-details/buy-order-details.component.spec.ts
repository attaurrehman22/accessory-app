import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyOrderDetailsComponent } from './buy-order-details.component';

describe('BuyOrderDetailsComponent', () => {
  let component: BuyOrderDetailsComponent;
  let fixture: ComponentFixture<BuyOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyOrderDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
