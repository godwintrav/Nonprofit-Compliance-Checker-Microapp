import { Component, inject, OnInit, signal } from '@angular/core';
import { ComplianceResultType } from '../model/compliance-result.type';
import { ComplianceCheckerService } from '../services/compliance-checker-service';
import { catchError } from 'rxjs';
import { HistoryEntry } from '../components/history-entry/history-entry';

@Component({
  selector: 'app-history',
  imports: [HistoryEntry],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History implements OnInit {
  isLoading = signal(false);
  entries = signal<ComplianceResultType[]>([]);
  hasError = signal(false);
  errorMessage = signal('')
  complianceSearchService = inject(ComplianceCheckerService);
  
  ngOnInit(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');
    this.entries.set([]);
    this.complianceSearchService.getSearchHistory().pipe(
      catchError((err) => {
        this.handleErrorResponse(err);
        throw err;
      })
    ).subscribe(
      (data) => this.handleSuccessResponse(data)
    )
  }
  
  private handleSuccessResponse(data: any) {
    this.isLoading.set(false);
    console.log(data);
    this.entries.set(data);
  }
  
  private handleErrorResponse(err: any) {
    this.isLoading.set(false);
    this.errorMessage.set(err.error.message);
    alert(err.error.message)
    this.hasError.set(true);
  }
}
