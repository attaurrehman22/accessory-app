import { Component, HostListener } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  isSmallScreen: boolean = false;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];

  constructor(private translateService: TranslateService) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("en");

    const browserlang = this.translateService.getBrowserLang();

    console.log("Browser Language => ", browserlang);

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth <= 1500;
  }

  ngOnInit() {
    this.isSmallScreen = window.innerWidth <= 1500;
  }

  useLang(lang: string) {
    console.log("Selected Language:", lang);
    this.translateService.use(lang);
    this.translateService.get("header.buy_watch").subscribe((translation) => {
      console.log("Translated Value:", translation);
    });
  }
}
