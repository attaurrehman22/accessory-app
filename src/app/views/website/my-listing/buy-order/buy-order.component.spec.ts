import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyOrderComponent } from './buy-order.component';

describe('BuyOrderComponent', () => {
  let component: BuyOrderComponent;
  let fixture: ComponentFixture<BuyOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
