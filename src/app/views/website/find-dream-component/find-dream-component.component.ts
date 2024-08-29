import { Component, HostListener } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-find-dream-component",
  templateUrl: "./find-dream-component.component.html",
  styleUrls: ["./find-dream-component.component.css"],
})
export class FindDreamComponentComponent {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;

  constructor(public  translateService: TranslateService) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();

    console.log("Browser Language => ", browserlang);
    this.currentLanguage=browserlang;

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
      
    }
  }
  useLang(lang: string) {
    console.log("Selected Language:", lang);
    this.translateService.use(lang);
    this.translateService.get("header.buy_watch").subscribe((translation) => {
      console.log("Translated Value:", translation);
    });
  }
}
