import { TestBed } from '@angular/core/testing';
import { ComplianceCheckerService } from './compliance-checker-service';

describe('ComplianceCheckerService', () => {
  let service: ComplianceCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
