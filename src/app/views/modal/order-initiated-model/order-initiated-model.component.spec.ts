import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderInitiatedModelComponent } from './order-initiated-model.component';

describe('OrderInitiatedModelComponent', () => {
  let component: OrderInitiatedModelComponent;
  let fixture: ComponentFixture<OrderInitiatedModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderInitiatedModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderInitiatedModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
