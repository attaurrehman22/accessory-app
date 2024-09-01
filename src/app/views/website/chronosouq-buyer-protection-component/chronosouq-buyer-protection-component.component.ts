import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-chronosouq-buyer-protection-component",
  templateUrl: "./chronosouq-buyer-protection-component.component.html",
  styleUrls: ["./chronosouq-buyer-protection-component.component.css"],
})
export class ChronosouqBuyerProtectionComponentComponent implements OnInit {
  commentsList: any;

  ngOnInit(): void {
    this.getAllComments();
  }

  getAllComments() {
    this.http.getBuyerProtectionCommnts().subscribe(
      (res) => {
        this.commentsList = res.data;
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
