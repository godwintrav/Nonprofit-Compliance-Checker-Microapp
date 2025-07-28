import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComplianceResultType } from '../model/compliance-result.type';

@Injectable({
  providedIn: 'root'
})
export class ComplianceCheckerService {
  http = inject(HttpClient);
  private API_URL = '/api/compliance';
  headers = new HttpHeaders({
      Authorization: 'Bearer mysecrettoken',
  });

  checkCompliance(ein: string): Observable<ComplianceResultType> {
    
    return this.http.get<ComplianceResultType>(`${this.API_URL}/verify/${ein}`, { headers: this.headers });
  }

  getSearchHistory(): Observable<ComplianceResultType[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer mysecrettoken',
    });
    return this.http.get<ComplianceResultType[]>(`${this.API_URL}/history`, { headers });
  }
}
