import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessorieDetailComponent } from './accessorie-detail.component';

describe('AccessorieDetailComponent', () => {
  let component: AccessorieDetailComponent;
  let fixture: ComponentFixture<AccessorieDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessorieDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessorieDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
