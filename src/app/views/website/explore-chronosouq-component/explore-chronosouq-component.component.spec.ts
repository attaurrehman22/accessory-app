import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreChronosouqComponentComponent } from './explore-chronosouq-component.component';

describe('ExploreChronosouqComponentComponent', () => {
  let component: ExploreChronosouqComponentComponent;
  let fixture: ComponentFixture<ExploreChronosouqComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreChronosouqComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExploreChronosouqComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
