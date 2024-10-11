import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-stay-loop-component',
  templateUrl: './stay-loop-component.component.html',
  styleUrls: ['./stay-loop-component.component.css']
})
export class StayLoopComponentComponent {
  constructor(public translateService: TranslateService) {
    const supportedLanguages = ["en", "ar"];
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang('en');

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages.includes(browserLang)) {
      this.translateService.use(browserLang);
    }
  }
}
