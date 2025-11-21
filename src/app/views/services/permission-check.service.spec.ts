import { TestBed } from '@angular/core/testing';

import { PermissionCheckService } from './permission-check.service';

describe('PermissionCheckService', () => {
  let service: PermissionCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
