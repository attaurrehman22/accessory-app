import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChronosouqBuyerProtectionComponentComponent } from './chronosouq-buyer-protection-component.component';

describe('ChronosouqBuyerProtectionComponentComponent', () => {
  let component: ChronosouqBuyerProtectionComponentComponent;
  let fixture: ComponentFixture<ChronosouqBuyerProtectionComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChronosouqBuyerProtectionComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChronosouqBuyerProtectionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
