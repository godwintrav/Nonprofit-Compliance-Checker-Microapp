import { Component, inject, signal } from '@angular/core';
import { ComplianceResult } from '../components/compliance-result/compliance-result';
import { ComplianceCheckerService } from '../services/compliance-checker-service';
import { catchError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ComplianceResultType } from '../model/compliance-result.type';

@Component({
  selector: 'app-search-non-profit',
  imports: [ComplianceResult, FormsModule],
  templateUrl: './search-non-profit.html',
  styleUrl: './search-non-profit.css'
})
export class SearchNonProfit {
  ein = signal('');
  isLoading = signal(false);
  result = signal<ComplianceResultType | null>(null);
  hasError = signal(false);
  errorMessage = signal('')
  complianceSearchService = inject(ComplianceCheckerService);
  
  onSubmit() {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');
    this.result.set(null);
    if (this.ein() && this.ein().trim() != '') {
      this.complianceSearchService.checkCompliance(this.ein().trim()).pipe(
        catchError((err) => {
          this.handleErrorResponse(err);
          throw err;
        })
      ).subscribe(
        (data) => this.handleSuccessResponse(data)
      )
    }
  }
  
  private handleSuccessResponse(data: any) {
    this.isLoading.set(false);
    console.log(data);
    this.result.set(data);
  }
  
  private handleErrorResponse(err: any) {
    this.isLoading.set(false);
    this.errorMessage.set(err.error.message);
    alert(err.error.message)
    this.hasError.set(true);
  }
  
}
