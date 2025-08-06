import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, UserRole } from '../models/admin.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    // Mock authentication - in real app, this would call your API
    if (email === 'admin@realestate.com' && password === 'admin123') {
      const user: User = {
        id: '1',
        email: 'admin@realestate.com',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        company: 'RealEstate CRM',
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      
      return of(user).pipe(delay(1000));
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }
}