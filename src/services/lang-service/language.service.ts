import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LanguageService implements OnDestroy {
  private currentLangSubject = new BehaviorSubject<string>(this.getSavedLanguage() || "ar");
  currentLang$ = this.currentLangSubject.asObservable();
  private subscription: Subscription = new Subscription(); // Subscription reference

  constructor() {}

  setLanguage(lang: string) {
    this.currentLangSubject.next(lang);
    this.saveLanguage(lang); // Save selected language to localStorage
  }

  getCurrentLanguage() {
    return this.currentLangSubject.value;
  }

  private saveLanguage(lang: string) {
    localStorage.setItem('selectedLanguage', lang);
  }

  private getSavedLanguage(): string | null {
    return localStorage.getItem('selectedLanguage');
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
