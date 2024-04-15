import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'http://localhost:3030/api/accounts'

  getHeaders():any {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('Authorization', token) : null;
  }

  postdata(payload: any, path: any): Observable<any> {
    return this.http.post<any>(environment.apiBaseUrl + path.url, payload, {headers:this.getHeaders()})
      .pipe(retry(0), catchError(this.errorHandl));
  }

  getdata(path: any): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + path.url, { headers: this.getHeaders() }).pipe(retry(0), catchError(this.errorHandl));
  }
  errorHandl(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}
