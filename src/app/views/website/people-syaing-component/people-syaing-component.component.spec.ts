import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleSyaingComponentComponent } from './people-syaing-component.component';

describe('PeopleSyaingComponentComponent', () => {
  let component: PeopleSyaingComponentComponent;
  let fixture: ComponentFixture<PeopleSyaingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleSyaingComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeopleSyaingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
