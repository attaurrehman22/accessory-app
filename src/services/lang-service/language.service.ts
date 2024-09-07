import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

   private currentLangSubject = new BehaviorSubject<string>('en'); // Default language is 'en'
  currentLang$ = this.currentLangSubject.asObservable();

  setLanguage(lang: string) {
    this.currentLangSubject.next(lang);
  }

  getCurrentLanguage() {
    return this.currentLangSubject.value;
  }
}
