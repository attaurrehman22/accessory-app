import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<string>(this.getSavedLanguage() || "ar");
  currentLang$ = this.currentLangSubject.asObservable();

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
}
