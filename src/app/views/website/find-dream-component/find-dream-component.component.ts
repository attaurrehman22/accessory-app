import { Component, HostListener, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";
import { LanguageService } from "src/services/lang-service/language.service";

@Component({
  selector: "app-find-dream-component",
  templateUrl: "./find-dream-component.component.html",
  styleUrls: ["./find-dream-component.component.css"],
})
export class FindDreamComponentComponent implements OnInit {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  staticList: any;

  homeData: any = { slider: [] }

  ngOnInit(): void {
    this.getStatics();
    this.getSlideData();
  }

  getSlideData() {
    this.http.getHomeData().subscribe(
      (res) => {
        this.homeData = res.data || { slider: [] };
      },
      (err) => {
        this.homeData = { slider: [] };
      }
    );
  }

  getStatics() {
    this.http.getStatics().subscribe(
      (res) => {
        this.staticList = res.statistics || {};
      },
      (err) => {
        this.staticList = {};
        console.log(err);
      }
    );
  }

  constructor(
    public translateService: TranslateService,
    private http: HttpService,
    private languageService:LanguageService
  ) {
    this.translateService.addLangs(this.supportLanguages);

    // Get the saved language from LanguageService
    const savedLang = this.languageService.getCurrentLanguage();

    // Use the saved language or fallback to browser language
    if (this.supportLanguages.includes(savedLang)) {
      this.translateService.use(savedLang);
    } else {
      const browserLang = this.translateService.getBrowserLang();
      console.log("Browser Language => ", browserLang);
      this.currentLanguage = browserLang;

      if (this.supportLanguages.includes(browserLang)) {
        this.translateService.use(browserLang);
        this.languageService.setLanguage(browserLang); // Save browser language if valid
      }
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
