import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  computed,
} from "@angular/core";
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
  isUserLogin: any = false;
  searchQuery: string = "";
  dropdownOpen = false;
  showHideAdminUser: any;
  showHideUser: any;

  isAdminUser = computed(() => this.loginStateService.isAdminUser());
  isUserLoggedIn = computed(() => this.loginStateService.isUserLoggedIn());

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

  @ViewChild('drawer') drawer: MatSidenav; 
  @ViewChild('header', { static: true }) headerRef: ElementRef; 
  @ViewChild('sidenav', { static: true }) sidenavRef: ElementRef;

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
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth <= 768;

    if (!this.isSmallScreen && this.drawer.opened) {
      this.drawer.close();
    }
  }

  ngOnInit() {
    this.isSmallScreen = window.innerWidth <= 1500;
    this.isUserLogin = localStorage.getItem("isLoggedIn");

    if (this.isUserLoggedIn()) {
      this.showHideUser = this.isUserLoggedIn();

      if (this.isAdminUser()) {
        this.showHideAdminUser = this.isAdminUser();
      } else {
        console.log("User is not an admin");
      }
    } else {
      console.log("User is not logged in");
    }
  }

  routeToAdminPannel() {
    this.router.navigate(["/admin/dashboard"]);
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
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user_token");
    this.isUserLogin = false;
    this.loginStateService.updateLoginStatus(false);
    localStorage.setItem("isAdmin", "false");
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("isLoggedIn", "false");
    this.router.navigateByUrl("login").then(() => {
      window.location.reload();
    });
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  routeToNewProduct() {
    this.router.navigate(["/new-product"]);
  }
  
  isSearchForm: any = false;
  openSearchForm() {
    this.isSearchForm = !this.isSearchForm;
  }



  isNavbarOpen = false;

  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  closeNavbar(): void {
    this.isNavbarOpen = false;
  }

  userListing(){
    this.router.navigate(['/myListing'])
  }
}
