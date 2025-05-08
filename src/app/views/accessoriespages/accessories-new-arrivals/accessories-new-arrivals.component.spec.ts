import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoriesNewArrivalsComponent } from './accessories-new-arrivals.component';

describe('AccessoriesNewArrivalsComponent', () => {
  let component: AccessoriesNewArrivalsComponent;
  let fixture: ComponentFixture<AccessoriesNewArrivalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessoriesNewArrivalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessoriesNewArrivalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
