import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-explore-chronosouq-component",
  templateUrl: "./explore-chronosouq-component.component.html",
  styleUrls: ["./explore-chronosouq-component.component.css"],
})
export class ExploreChronosouqComponentComponent {
  selectedStep: number = 1;

  selectStep(step: number) {
    this.selectedStep = step;
  }

  constructor(
    public translateService: TranslateService,
    private http: HttpService
  ) {
    const supportedLanguages = ["en", "ar"]; 
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang("en");

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages.includes(browserLang)) {
      this.translateService.use(browserLang);
    }
  }
}
