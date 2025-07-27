import { Component, input } from '@angular/core';
import { ComplianceResultType } from '../../model/compliance-result.type';

@Component({
  selector: 'app-compliance-result',
  imports: [],
  templateUrl: './compliance-result.html',
  styleUrl: './compliance-result.css'
})
export class ComplianceResult {
  result = input.required<ComplianceResultType>()
}
