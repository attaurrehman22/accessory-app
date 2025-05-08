import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoriesHomeComponent } from './accessories-home.component';

describe('AccessoriesHomeComponent', () => {
  let component: AccessoriesHomeComponent;
  let fixture: ComponentFixture<AccessoriesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessoriesHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessoriesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
