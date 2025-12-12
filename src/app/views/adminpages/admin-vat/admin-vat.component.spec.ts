import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVatComponent } from './admin-vat.component';

describe('AdminVatComponent', () => {
  let component: AdminVatComponent;
  let fixture: ComponentFixture<AdminVatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminVatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
