import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessorySummaryComponent } from './accessory-summary.component';

describe('AccessorySummaryComponent', () => {
  let component: AccessorySummaryComponent;
  let fixture: ComponentFixture<AccessorySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessorySummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessorySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
