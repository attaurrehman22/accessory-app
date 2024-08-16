import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindDreamComponentComponent } from './find-dream-component.component';

describe('FindDreamComponentComponent', () => {
  let component: FindDreamComponentComponent;
  let fixture: ComponentFixture<FindDreamComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindDreamComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindDreamComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
