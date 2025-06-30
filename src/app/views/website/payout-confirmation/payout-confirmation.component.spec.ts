import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutConfirmationComponent } from './payout-confirmation.component';

describe('PayoutConfirmationComponent', () => {
  let component: PayoutConfirmationComponent;
  let fixture: ComponentFixture<PayoutConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayoutConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayoutConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
