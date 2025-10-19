import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveFavConfirmationComponent } from './remove-fav-confirmation.component';

describe('RemoveFavConfirmationComponent', () => {
  let component: RemoveFavConfirmationComponent;
  let fixture: ComponentFixture<RemoveFavConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveFavConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemoveFavConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
