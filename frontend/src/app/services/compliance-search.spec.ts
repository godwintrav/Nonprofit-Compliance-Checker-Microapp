import { TestBed } from '@angular/core/testing';

import { ComplianceSearch } from './compliance-search';

describe('ComplianceSearch', () => {
  let service: ComplianceSearch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceSearch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
