import { Injectable, } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LanguageService   {
  private currentLangSubject = new BehaviorSubject<string>(this.getSavedLanguage() || "ar");
  currentLang$ = this.currentLangSubject.asObservable();
  private subscription: Subscription = new Subscription(); 

  constructor() {}

  setLanguage(lang: string) {
    this.currentLangSubject.next(lang);
    this.saveLanguage(lang); 
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

 
}
