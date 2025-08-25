import { TestBed } from '@angular/core/testing';

import { HoverStateService } from './hover-state.service';

describe('HoverStateService', () => {
  let service: HoverStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoverStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
