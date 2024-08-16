import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostPopularModelsComponentComponent } from './most-popular-models-component.component';

describe('MostPopularModelsComponentComponent', () => {
  let component: MostPopularModelsComponentComponent;
  let fixture: ComponentFixture<MostPopularModelsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostPopularModelsComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MostPopularModelsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
