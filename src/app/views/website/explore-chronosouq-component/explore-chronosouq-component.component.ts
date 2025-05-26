import { Component, HostListener , OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-explore-chronosouq-component",
  templateUrl: "./explore-chronosouq-component.component.html",
  styleUrls: ["./explore-chronosouq-component.component.css"],
})
export class ExploreChronosouqComponentComponent implements OnInit{
    apiUrl = environment.apiimagespath;
  selectedStep: number = 1;
  isSmallScreen = false;
  selectStep(step: number) {
    this.selectedStep = step;
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
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
