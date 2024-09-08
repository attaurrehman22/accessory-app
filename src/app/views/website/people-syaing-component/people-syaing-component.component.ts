import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-people-syaing-component",
  templateUrl: "./people-syaing-component.component.html",
  styleUrls: ["./people-syaing-component.component.css"],
})
export class PeopleSyaingComponentComponent implements OnInit {
  ngOnInit(): void {
    this.getHowItWorksData();
  }
  dataList: any;
  getHowItWorksData() {
    this.http.getHowItWorksData().subscribe(
      (res) => {
        this.dataList = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  constructor(
    private translateService: TranslateService,
    private http: HttpService
  ) {
    const supportedLanguages = ["en", "ar"]; // Add other languages if necessary
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang("en");

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages.includes(browserLang)) {
      this.translateService.use(browserLang);
    }
  }

  useLang(lang: string) {
    this.translateService.use(lang);
  }
}
