import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularBrandsComponentComponent } from './popular-brands-component.component';

describe('PopularBrandsComponentComponent', () => {
  let component: PopularBrandsComponentComponent;
  let fixture: ComponentFixture<PopularBrandsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularBrandsComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopularBrandsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
