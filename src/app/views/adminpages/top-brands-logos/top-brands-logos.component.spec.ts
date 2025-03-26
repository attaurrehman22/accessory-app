import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBrandsLogosComponent } from './top-brands-logos.component';

describe('TopBrandsLogosComponent', () => {
  let component: TopBrandsLogosComponent;
  let fixture: ComponentFixture<TopBrandsLogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBrandsLogosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopBrandsLogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
