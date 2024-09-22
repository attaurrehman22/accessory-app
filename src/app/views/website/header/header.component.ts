import { Component, HostListener, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/services/lang-service/language.service";
import { MatSidenav } from "@angular/material/sidenav";
import { SearchServiceService } from "src/services/search-service/search-service.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  isSmallScreen: boolean = false;
  isUserLogin: any;
  searchQuery: string = '';

  searchFilter:boolean=true;
  supportLanguages = [
    { name: "English", value: "en" },
    { name: "العربية", value: "ar" },
    { name: "Français", value: "fr" },
    { name: "தமிழ்", value: "ta" },
    { name: "हिन्दी", value: "hi" },
  ];
  isRtl: boolean = false;
  selectedLang: string = "en";

  @ViewChild('drawer') drawer: MatSidenav; // Access sidenav
  @ViewChild('sidenav', { static: true }) sidenavRef: ElementRef; // Access sidenav ElementRef
  @ViewChild('header', { static: false }) headerRef: ElementRef;  // Access header

  constructor(
    public translateService: TranslateService,
    private languageService: LanguageService,
    public router: Router,
    private searchService: SearchServiceService
  ) {
    const languagevalues = this.supportLanguages.map((lang) => lang.value);
    this.translateService.addLangs(languagevalues);
    this.translateService.setDefaultLang("en");

    const browserlang = this.translateService.getBrowserLang();

    if (languagevalues.includes(browserlang)) {
      this.translateService.use(browserlang);
      this.isRtl = browserlang !== "en";
    }

    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.searchFilter = ['/product-list'].includes(currentRoute);
    });

    this.languageService.currentLang$.subscribe((lang) => {
      this.translateService.use(lang);
      this.isRtl = lang !== "en";
      this.selectedLang = lang;
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth <= 768;
  }

  ngOnInit() {
    this.isUserLogin = localStorage.getItem("Logged");
    this.isSmallScreen = window.innerWidth <= 1500;
  }

  onSearch(query: string) {
    this.searchService.changeSearchQuery(query);
  }

  onSearchChange() {
    this.onSearch(this.searchQuery);
  }

  useLang(lang: string) {
    this.languageService.setLanguage(lang);
  }

  routeToBuyProduct() {
    this.router.navigate(["/product-list"]);
  }

  goToRegister() {
    this.router.navigateByUrl("login");
  }

  logout() {
    localStorage.removeItem("Logged");
    localStorage.removeItem("user_token");
    this.isUserLogin = null;
    this.router.navigateByUrl("login");
  }

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  routeToNewProduct() {
    // const token = localStorage.getItem("user_token");
    // const rerouteUrl = "new-product";
    // localStorage.setItem("navigate_url", rerouteUrl);
    // if (token) {
      this.router.navigate(["/new-product"]);
    // } else {
      // this.router.navigate(["/login"]);
    // }
  }

  // Close the sidenav on outside click
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedElement = event.target as HTMLElement;

    // Get references for the header and sidenav DOM elements
    const isOutsideHeader = this.headerRef?.nativeElement && !this.headerRef.nativeElement.contains(clickedElement);
    const isOutsideSidenav = this.sidenavRef?.nativeElement && !this.sidenavRef.nativeElement.contains(clickedElement);

    // If click is outside both the header and the sidenav, close the sidenav
    if (isOutsideHeader && isOutsideSidenav && this.drawer.opened) {
      this.drawer.close();
    }
  }
}
