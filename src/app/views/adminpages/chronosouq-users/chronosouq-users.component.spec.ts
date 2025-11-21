import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChronosouqUsersComponent } from './chronosouq-users.component';

describe('ChronosouqUsersComponent', () => {
  let component: ChronosouqUsersComponent;
  let fixture: ComponentFixture<ChronosouqUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChronosouqUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChronosouqUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
