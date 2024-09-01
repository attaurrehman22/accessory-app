import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyProductComponentComponent } from './buy-product-component.component';

describe('BuyProductComponentComponent', () => {
  let component: BuyProductComponentComponent;
  let fixture: ComponentFixture<BuyProductComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyProductComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyProductComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
