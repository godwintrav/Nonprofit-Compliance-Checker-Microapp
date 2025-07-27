import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceResult } from './compliance-result';

describe('ComplianceResult', () => {
  let component: ComplianceResult;
  let fixture: ComponentFixture<ComplianceResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
