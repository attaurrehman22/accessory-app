import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private currentLang = new BehaviorSubject<string>('en');
  currentLang$ = this.currentLang.asObservable();

  setLanguage(lang: string) {
    this.currentLang.next(lang);
  }

  getLanguage() {
    return this.currentLang.getValue();
  }
}
