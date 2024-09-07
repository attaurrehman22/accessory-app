import { TestBed } from '@angular/core/testing';

import { AlertsServicesService } from './alerts-services.service';

describe('AlertsServicesService', () => {
  let service: AlertsServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
