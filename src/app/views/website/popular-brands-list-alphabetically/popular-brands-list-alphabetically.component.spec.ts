import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularBrandsListAlphabeticallyComponent } from './popular-brands-list-alphabetically.component';

describe('PopularBrandsListAlphabeticallyComponent', () => {
  let component: PopularBrandsListAlphabeticallyComponent;
  let fixture: ComponentFixture<PopularBrandsListAlphabeticallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularBrandsListAlphabeticallyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopularBrandsListAlphabeticallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
