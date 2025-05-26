import { Component, HostListener, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
import { HttpService } from "src/services/http/http.service";
import { LanguageService } from "src/services/lang-service/language.service";

@Component({
  selector: "app-find-dream-component",
  templateUrl: "./find-dream-component.component.html",
  styleUrls: ["./find-dream-component.component.css"],
})
export class eamFindDreamComponentComponent implements OnInit {
  apiUrl = environment.apiimagespath;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  staticList: any;
  isUserLogin: any=false;
  homeData: any = { slider: [] }

  ngOnInit(): void {
    this.isUserLogin=localStorage.getItem('isLoggedIn')
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
      }
    );
  }

  constructor(
    public translateService: TranslateService,
    private http: HttpService,
    private languageService:LanguageService,
    private router:Router
  ) {
    this.translateService.addLangs(this.supportLanguages);
    const savedLang = this.languageService.getCurrentLanguage();
    if (this.supportLanguages.includes(savedLang)) {
      this.translateService.use(savedLang);
    } else {
      const browserLang = this.translateService.getBrowserLang();
      this.currentLanguage = browserLang;

      if (this.supportLanguages.includes(browserLang)) {
        this.translateService.use(browserLang);
        this.languageService.setLanguage(browserLang);
      }
    }
  }

  routeTo(){
    this.router.navigate(['/new-product'])
  }

  routeToLogin(){
    this.router.navigate(['/login'])
  }
}
