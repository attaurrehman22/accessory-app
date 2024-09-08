import { Component, HostListener, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-find-dream-component",
  templateUrl: "./find-dream-component.component.html",
  styleUrls: ["./find-dream-component.component.css"],
})
export class FindDreamComponentComponent implements OnInit {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  staticList: any;

  homeData: any;

  ngOnInit(): void {
    this.getStatics();
    this.getSlideData();
  }

  getSlideData() {
    this.http.getHomeData().subscribe(
      (res) => {
        this.homeData = res.data;
      },
      (err) => []
    );
  }

  getStatics() {
    this.http.getStatics().subscribe(
      (res) => {
        this.staticList = res.statistics;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  constructor(
    public translateService: TranslateService,
    private http: HttpService
  ) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();

    console.log("Browser Language => ", browserlang);
    this.currentLanguage = browserlang;

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
