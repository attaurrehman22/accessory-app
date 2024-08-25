import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chronosouq-buyer-protection-component',
  templateUrl: './chronosouq-buyer-protection-component.component.html',
  styleUrls: ['./chronosouq-buyer-protection-component.component.css']
})
export class ChronosouqBuyerProtectionComponentComponent {
  constructor(private translateService: TranslateService) {
    const supportedLanguages = ["en", "ar"]; // Add other languages if necessary
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang('en');

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages.includes(browserLang)) {
      this.translateService.use(browserLang);
    }
  }

  useLang(lang: string) {
    this.translateService.use(lang);
  }
}
