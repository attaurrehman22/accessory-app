import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-footer-component',
  templateUrl: './footer-component.component.html',
  styleUrls: ['./footer-component.component.css']
})
export class FooterComponentComponent {

  supportLanguages = [
    {name:"English",value:"en"},
    {name:"العربية",value:"ar"},
    {name:"Français",value:"fr"},
    {name:"தமிழ்",value:"ta"},
    {name:"हिन्दी",value:"hi"},
  ];

  isRtl: boolean = false; 

  constructor(public translateService: TranslateService,
    private languageService:LanguageService
  ) {
    const supportedLanguages = ["en", "ar"];
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang('en');

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages.includes(browserLang)) {
      this.translateService.use(browserLang);
    }

    this.languageService.currentLang$.subscribe(lang => {
      this.translateService.use(lang);
      this.isRtl = lang !== 'en';
    });
  }

  useLang(lang: string) {
    this.languageService.setLanguage(lang);
    // console.log("Selected Language:", lang);
    // this.translateService.use(lang);
    // this.isRtl = lang !== 'en';
  }

}
