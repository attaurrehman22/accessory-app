import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchInfoComponent } from './watch-info.component';

describe('WatchInfoComponent', () => {
  let component: WatchInfoComponent;
  let fixture: ComponentFixture<WatchInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WatchInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
