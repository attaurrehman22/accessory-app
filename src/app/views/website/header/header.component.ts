import { Component, HostListener, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/services/lang-service/language.service";
import { MatSidenav } from "@angular/material/sidenav";
import { SearchServiceService } from "src/services/search-service/search-service.service";
import { LoginStateService } from "src/services/login-service/login-state.service";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  isSmallScreen: boolean = false;
  isUserLogin: any = "";
  searchQuery: string = "";

  searchFilter: boolean = true;
  supportLanguages = [
    { name: "English", value: "en" },
    { name: "العربية", value: "ar" },
    { name: "Français", value: "fr" },
    { name: "தமிழ்", value: "ta" },
    { name: "हिन्दी", value: "hi" },
  ];
  isRtl: boolean = false;
  selectedLang: string = "en";

  @ViewChild("drawer") drawer: MatSidenav; // Access sidenav
  @ViewChild("sidenav", { static: true }) sidenavRef: ElementRef; // Access sidenav ElementRef
  @ViewChild("header", { static: false }) headerRef: ElementRef; // Access header

  constructor(
    public translateService: TranslateService,
    private languageService: LanguageService,
    public router: Router,
    private searchService: SearchServiceService,
    private loginStateService: LoginStateService,
    private cdRef: ChangeDetectorRef
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
      this.searchFilter = ["/product-list"].includes(currentRoute);
    });

    this.languageService.currentLang$.subscribe((lang) => {
      this.translateService.use(lang);
      this.isRtl = lang !== "en";
      this.selectedLang = lang;
    });

    this.loginStateService.isAdminUser$.subscribe((isAdmin) => {
      this.isAdminUser = isAdmin;
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth <= 768;
  }

  isAdminUser: any = "";

  ngOnInit() {
    this.loginStateService.isUserLoggedIn$.subscribe((isLoggedIn) => {
      this.isUserLogin = isLoggedIn ? "LogIn" : "";
      this.cdRef.detectChanges();
    });
    this.isSmallScreen = window.innerWidth <= 1500;
    this.isAdminUser = localStorage.getItem("isAdminLogin");
    console.log(this.isUserLogin, this.isSmallScreen);
  }

  routeToAdminPannel() {
    this.router.navigate(["/admin-dashboard"]);
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
    this.isUserLogin = "";
    this.isAdminUser = "";
    this.loginStateService.updateAdminStatus(this.isAdminUser);
    this.loginStateService.updateLoginStatus(false);
    this.router.navigateByUrl("login");
  }

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  routeToNewProduct() {
    this.router.navigate(["/new-product"]);
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: Event) {
    const clickedElement = event.target as HTMLElement;
  
    // Ensure header and sidenav are present
    const isOutsideHeader = this.headerRef?.nativeElement && !this.headerRef.nativeElement.contains(clickedElement);
    const isOutsideSidenav = this.sidenavRef?.nativeElement && !this.sidenavRef.nativeElement.contains(clickedElement);
  
    console.log('drawer:', this.drawer);
    if (this.drawer && this.drawer.opened) {
      console.log('----------------------:', this.drawer);
      if (isOutsideHeader && isOutsideSidenav) {
        this.drawer.close();
      }
    }
  }
  

  isSearchForm: any = false;

  openSearchForm() {
    this.isSearchForm = !this.isSearchForm;
  }
}
