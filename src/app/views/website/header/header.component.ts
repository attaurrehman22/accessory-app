import { Component, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/services/lang-service/language.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  isSmallScreen: boolean = false;
  supportLanguages = [
    {name:"English",value:"en"},
    {name:"العربية",value:"ar"},
    {name:"Français",value:"fr"},
    {name:"தமிழ்",value:"ta"},
    {name:"हिन्दी",value:"hi"},
  ];
  isRtl: boolean = false; 

  constructor(public translateService: TranslateService,
    private languageService:LanguageService,public router: Router) {

    const languagevalues=this.supportLanguages.map(lang=>lang.value)
    this.translateService.addLangs(languagevalues);
    this.translateService.setDefaultLang("en");

    const browserlang = this.translateService.getBrowserLang();

    console.log("Browser Language => ", browserlang);

    if (languagevalues.includes(browserlang)) {
      this.translateService.use(browserlang);
      //
      this.isRtl = browserlang !== 'en';
    }

    this.languageService.currentLang$.subscribe(lang => {
      this.translateService.use(lang);
      this.isRtl = lang !== 'en';
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth <= 1500;
  }

  ngOnInit() {
    this.isSmallScreen = window.innerWidth <= 1500;
  }

  useLang(lang: string) {
    // console.log("Selected Language:", lang);
    // this.translateService.use(lang);
    this.languageService.setLanguage(lang);
    //
    // this.isRtl = lang !== 'en';
  }

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goToRegister(){
    this.router.navigateByUrl('register')
  }

  routeToNewProduct(){
    console.log("----------------")
    this.router.navigate(['/new-product']);
  }
}
