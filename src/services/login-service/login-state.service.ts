import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginStateService {
  private isAdminUserSource = new BehaviorSubject<boolean>(false);
  isAdminUser$ = this.isAdminUserSource.asObservable();

  updateAdminStatus(isAdmin: boolean) {
    this.isAdminUserSource.next(isAdmin);
  }

  private loginStatus = new BehaviorSubject<boolean>(false);
  isUserLoggedIn$ = this.loginStatus.asObservable();

  updateLoginStatus(isLoggedIn: boolean) {
    this.loginStatus.next(isLoggedIn); // Update login status
  }
}
