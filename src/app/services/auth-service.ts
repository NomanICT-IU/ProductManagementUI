import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth-response-model';
import { SignInRequest } from '../models/signin-request-model';
import { SignUpRequest } from '../models/signup-request-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:44313/api/Account';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  signUp(data: SignUpRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, data);
  }

  signIn(data: SignInRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, data);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveEmail(email: string): void {
    localStorage.setItem('userEmail', email);
  }

  getEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
