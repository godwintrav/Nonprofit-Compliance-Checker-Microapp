import { Component, inject, signal } from '@angular/core';
import { ComplianceResult } from '../components/compliance-result/compliance-result';
import { ComplianceSearch } from '../services/compliance-search';
import { catchError } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-non-profit',
  imports: [ComplianceResult, FormsModule],
  templateUrl: './search-non-profit.html',
  styleUrl: './search-non-profit.css'
})
export class SearchNonProfit {
  ein = signal('');
  isLoading = signal(false);
  result = signal<ComplianceResult | null>(null);
  hasError = signal(false);
  complianceSearchService = inject(ComplianceSearch);
  
  onSubmit() {
    this.isLoading.set(true);
    this.hasError.set(false);
    if (this.ein() && this.ein().trim() != '') {
      this.complianceSearchService.checkCompliance(this.ein()).pipe(
        catchError((err) => {
          this.handleErrorResponse(err);
          throw err;
        })
      ).subscribe(
        (data) => this.handleSuccessResponse(data)
      )
    }
    this.isLoading.set(false);
  }
  
  private handleSuccessResponse(data: any) {
    console.log(data);
    this.result.set(data);
  }
  
  private handleErrorResponse(err: any) {
    console.log(err);
    alert('Error fetching compliance')
    this.hasError.set(true);
  }
  
}
