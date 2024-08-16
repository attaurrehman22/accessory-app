import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowWorksComponentComponent } from './how-works-component.component';

describe('HowWorksComponentComponent', () => {
  let component: HowWorksComponentComponent;
  let fixture: ComponentFixture<HowWorksComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowWorksComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HowWorksComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
