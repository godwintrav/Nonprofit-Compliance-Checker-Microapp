import { Component, input } from '@angular/core';
import { ComplianceResultType } from '../../model/compliance-result.type';

@Component({
  selector: 'app-history-entry',
  imports: [],
  templateUrl: './history-entry.html',
  styleUrl: './history-entry.css'
})
export class HistoryEntry {
  entry = input.required<ComplianceResultType>()
}
