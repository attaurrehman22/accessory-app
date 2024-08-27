import { Component, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  isSmallScreen: boolean = false;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];

  constructor(private translateService: TranslateService,public router: Router) {
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
  }

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goToRegister(){
    this.router.navigateByUrl('register')
  }

  routeToNewProduct(){
    this.router.navigateByUrl('new-product')
  }
}
