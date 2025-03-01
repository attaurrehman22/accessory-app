import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchOfTheDayComponent } from './watch-of-the-day.component';

describe('WatchOfTheDayComponent', () => {
  let component: WatchOfTheDayComponent;
  let fixture: ComponentFixture<WatchOfTheDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchOfTheDayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WatchOfTheDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
