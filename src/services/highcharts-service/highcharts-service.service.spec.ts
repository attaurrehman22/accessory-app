import { TestBed } from '@angular/core/testing';

import { HighchartsServiceService } from './highcharts-service.service';

describe('HighchartsServiceService', () => {
  let service: HighchartsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HighchartsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
