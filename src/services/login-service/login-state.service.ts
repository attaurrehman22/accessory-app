import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoginStateService {

  isAdminUser = signal<boolean>(this.getStoredAdminStatus());
  isUserLoggedIn = signal<boolean>(this.getStoredLoginStatus());


  updateAdminStatus(isAdmin: boolean) {
    this.isAdminUser.set(isAdmin);
    localStorage.setItem("isAdmin", JSON.stringify(isAdmin)); 
  }

 
  updateLoginStatus(isLoggedIn: boolean) {
    this.isUserLoggedIn.set(isLoggedIn);
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn)); 
  }

  private getStoredAdminStatus(): boolean {
    const storedAdminStatus = localStorage.getItem("isAdmin");
    return storedAdminStatus ? JSON.parse(storedAdminStatus) : false;
  }

  private getStoredLoginStatus(): boolean {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    return storedLoginStatus ? JSON.parse(storedLoginStatus) : false;
  }
}
