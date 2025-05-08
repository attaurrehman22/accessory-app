import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectProductModalComponent } from './reject-product-modal.component';

describe('RejectProductModalComponent', () => {
  let component: RejectProductModalComponent;
  let fixture: ComponentFixture<RejectProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectProductModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RejectProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
