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
  isUserLogin:any;
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
    this.isUserLogin=localStorage.getItem('Logged')
    this.isSmallScreen = window.innerWidth <= 1500;
  }

  useLang(lang: string) {
    // console.log("Selected Language:", lang);
    // this.translateService.use(lang);
    this.languageService.setLanguage(lang);
    //
    // this.isRtl = lang !== 'en';
  }

  routeToBuyProduct(){
    // console.log("hello")
    // const token=localStorage.getItem('token');
    // console.log("token",token)
    // if(token){
      this.router.navigate(['/product-list'])
    // }
    // else{
    //   this.router.navigate(['/login'],{
    //     state:{paramRoute:'buy-product'}
    //   })
    // }
  }

  goToRegister() { 
      this.router.navigateByUrl('register');
  }

  logout() {
    localStorage.removeItem('Logged');
    localStorage.removeItem('token');
    this.isUserLogin = null;
    this.router.navigateByUrl('login');
  }

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // goToRegister(){
  //   this.router.navigateByUrl('register')
  // }

  routeToNewProduct(){
    console.log("----------------")
    this.router.navigate(['/new-product']);
  }
}
