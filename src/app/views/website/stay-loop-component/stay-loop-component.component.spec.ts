import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StayLoopComponentComponent } from './stay-loop-component.component';

describe('StayLoopComponentComponent', () => {
  let component: StayLoopComponentComponent;
  let fixture: ComponentFixture<StayLoopComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StayLoopComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StayLoopComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
