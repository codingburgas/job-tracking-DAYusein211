import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, UpdateApplicationStatusRequest } from '../models/application.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private http: HttpClient) {}

  submitApplication(jobId: number): Observable<Application> {
    return this.http.post<Application>(`${environment.apiUrl}/applications/submit/${jobId}`, {});
  }

  getMyApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${environment.apiUrl}/applications/my-applications`);
  }

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${environment.apiUrl}/applications`);
  }

  getJobApplications(jobId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${environment.apiUrl}/applications/job/${jobId}`);
  }

  updateApplicationStatus(id: number, request: UpdateApplicationStatusRequest): Observable<Application> {
    return this.http.put<Application>(`${environment.apiUrl}/applications/${id}/status`, request);
  }
}