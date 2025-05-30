import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private isLoadingSubject = new BehaviorSubject<boolean>(false); // private subject to manage loading state
  isLoading = this.isLoadingSubject.asObservable(); // expose the observable for components to subscribe to

  constructor(private router: Router) {
    // Automatically hide the loader on certain routes (e.g., product-list)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd) // listen to route changes
    ).subscribe(event => {
      const currentRoute = this.router.url;
      console.log("currentRoute",currentRoute)
      console.log("currentRoute.includes('/register')",currentRoute.includes('/register'))
      // Skip loader for specific routes
      if (currentRoute.includes('/product-list') || currentRoute.includes('/login') || currentRoute.includes('/register') || currentRoute.includes('/check-email-existence') || currentRoute.includes('/check-user-existence')) {
      
        this.isLoadingSubject.next(false); // Set loader to false for /product-list
      } else {
        this.isLoadingSubject.next(true); // Default to show loader for other routes
      }
    });
  }

  // Method to manually show the loader
  show() {
    this.isLoadingSubject.next(true);
  }

  // Method to manually hide the loader
  hide() {
    this.isLoadingSubject.next(false);
  }

  // Method to toggle the loader state
  toggle() {
    this.isLoadingSubject.next(!this.isLoadingSubject.value);
  }
}
