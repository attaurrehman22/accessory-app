import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-footer-component',
  templateUrl: './footer-component.component.html',
  styleUrls: ['./footer-component.component.css']
})
export class FooterComponentComponent {
  isRtl = false;
  selectedLang = "en";

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    public translateService: TranslateService,
    private languageService: LanguageService
  ) {
    const initial = this.languageService.getCurrentLanguage();
    this.selectedLang = initial;
    this.isRtl = initial !== "en";

    this.languageService.currentLang$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lang) => {
        this.translateService.use(lang);
        this.isRtl = lang !== "en";
        this.selectedLang = lang;
      });
  }

  useLang(lang: string) {
    this.languageService.setLanguage(lang);
  }

}
