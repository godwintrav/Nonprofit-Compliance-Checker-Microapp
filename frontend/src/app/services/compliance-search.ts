import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComplianceResultType } from '../model/compliance-result.type';

@Injectable({
  providedIn: 'root'
})
export class ComplianceSearch {
  http = inject(HttpClient);
  private API_URL = 'http://localhost:3000/compliance/verify';

  checkCompliance(ein: string): Observable<ComplianceResultType> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer mysecrettoken',
    });
    return this.http.get<ComplianceResultType>(`${this.API_URL}/${ein}`, { headers });
  }
}
