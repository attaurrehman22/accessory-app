import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  computed,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/services/lang-service/language.service";
import { MatSidenav } from "@angular/material/sidenav";
import { SearchServiceService } from "src/services/search-service/search-service.service";
import { LoginStateService } from "src/services/login-service/login-state.service";
import { ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ModelLoginComponent } from "../../auth/model-login/model-login.component";
import { MatMenuTrigger } from "@angular/material/menu";
// import * as jwt_decode from 'jwt-decode';
// import { jwt_decode } from 'jwt-decode';
import { jwtDecode } from "jwt-decode";
import { HttpService } from "src/services/http/http.service";
import { filter } from "rxjs/operators";
import { ShoppingCartComponent } from "../../modal/shopping-cart/shopping-cart.component";
import { MessageServiceService } from "src/services/search-show-hide/message-service.service";
import { environment } from "src/environments/environment";
import { PermissionCheckService } from "../../services/permission-check.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  apiUrl = environment.apipath + "/";
  isSmallScreen: boolean = false;
  isUserLogin: any = false;
  searchQuery: string = "";
  dropdownOpen = false;
  showHideAdminUser: any;
  showHideUser: any;
  isNewArrivalsProduct: boolean = false;

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
  adminPermissionToRouteMatch = [
    {
      permission: "admin.dashboard.view",
      route: "/admin/dashboard",
    },
    {
      permission: "admin.products.view",
      route: "/admin/products",
    },
    {
      permission: "admin.brands.view",
      route: "/admin/brands",
    },
    {
      permission: "admin.categories.view",
      route: "/admin/category",
    },
    {
      permission: "admin.users.view",
      route: "/admin/users",
    },
    {
      permission: "admin.vat.view",
      route: "/admin/vat",
    },
    {
      permission: "admin.watch.view",
      route: "/admin/watchOfDay",
    },
    {
      permission: "admin.chronosouq-users.view",
      route: "/admin/chronosouq-users",
    },
    {
      permission: "admin.roles.view",
      route: "/admin/roles",
    },
  ];

  @ViewChild("drawer") drawer: MatSidenav;
  @ViewChild("header", { static: true }) headerRef: ElementRef;
  @ViewChild("sidenav", { static: true }) sidenavRef: ElementRef;

  constructor(
    public translateService: TranslateService,
    private languageService: LanguageService,
    public router: Router,
    private searchService: SearchServiceService,
    private loginStateService: LoginStateService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private http: HttpService,
    private searchShowHide: MessageServiceService,
    private permissionCheckService: PermissionCheckService
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

  @ViewChild("search2MenuTrigger") search2MenuTrigger: MatMenuTrigger;
  @ViewChild("search3MenuTrigger") search3MenuTrigger: MatMenuTrigger;
  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.isSmallScreen = window?.innerWidth <= 768;

    if (this.search3MenuTrigger && this.search3MenuTrigger?.menuOpen) {
      this.search3MenuTrigger.closeMenu();
    }

    if (this.search2MenuTrigger && this.search2MenuTrigger?.menuOpen) {
      this.search2MenuTrigger.closeMenu();
    }
    if (!this.isSmallScreen && this.drawer?.opened) {
      this.drawer.close();
    }
  }

  isShowSearchField: boolean = false;
  isManuallyToggled = false;

  isShowSearchForm() {
    this.isManuallyToggled = true;
    this.isShowSearchField = !this.isShowSearchField;
  }

  userToken: any;

  isSmallScreenScreen: boolean = window.innerWidth <= 991;

  checkScreenSize() {
    this.isSmallScreenScreen = window.innerWidth <= 991;
  }

  ngOnInit() {
    this.isSmallScreen = window.innerWidth <= 1500;

    // if(this.isManuallyToggled && this.isShowSearchField){
    this.searchShowHide.getMessage().subscribe((msg) => {
      if (
        this.isManuallyToggled &&
        this.isShowSearchField &&
        this.isSearchActive
      ) {
        this.isShowSearchField = true;
        this.isManuallyToggled = false;
      } else {
        this.isShowSearchField = false;
      }
    });
    // }
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize.bind(this));

    this.isUserLogin = localStorage.getItem("isLoggedIn");

    this.userToken = localStorage.getItem("user_token");
    if (this.userToken) {
      this.getUserDetails();
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Close the sidebar when a route change occurs
        this.isNavbarOpen = false;
      });

    if (this.isUserLoggedIn()) {
      this.showHideUser = this.isUserLoggedIn();
      console.log("IsAdminUser ----------- ", this.isAdminUser());
      if (this.isAdminUser()) {
        this.showHideAdminUser = this.isAdminUser();
      }
    }
    this.callForNewArrivals(); // <-- Call immediately once
    setInterval(() => {
      this.callForNewArrivals();
    }, 3 * 60 * 1000); // 30 minutes in milliseconds
  }

  // call this function to check new arrivals product
  callForNewArrivals() {
    // this.isNewArrivalsProduct = true
    this.http.getHeaderNewArrivalsProductDotIconChecker().subscribe((res) => {
      if (res?.new_count > 0) {
        this.isNewArrivalsProduct = true;
      } else {
        this.isNewArrivalsProduct = false;
      }
    });
  }

  userDetails: any;

  getUserDetails() {
    this.http.gtUserDetails().subscribe((res) => {
      this.userDetails = res.user;
    });
  }

  routeToAdminPannel() {
    for (const item of this.adminPermissionToRouteMatch) {
      if (this.permissionCheckService.checkPermission(item.permission)) {
        this.router.navigate([item.route]);
        return;
      }
    }
  }

  isSearchActive: boolean = true;

  onSearchInputClick() {
    this.isSearchActive = true;
    this.isManuallyToggled = true;
  }

  onSearch(query: string) {
    this.isSearchActive = true;
    this.isManuallyToggled = true;
    if (this.search3MenuTrigger && this.search3MenuTrigger.menuOpen) {
      this.search3MenuTrigger.closeMenu();
    }
    this.searchService.changeSearchQuery(query);
    this.router.navigate(["/product-list"], { queryParams: { query } });

    this.isShowSearchField = false;
    this.searchQuery = "";
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
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userID");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userType");
    sessionStorage.clear();
    this.isUserLogin = false;
    this.loginStateService.updateLoginStatus(false);
    localStorage.setItem("isAdmin", "false");
    this.router.navigateByUrl("login").then(() => {
      window.location.reload();
    });
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  loginFirst() {
    const dialogRef = this.dialog.open(ModelLoginComponent, {
      width: "600px",
      data: { message: "header" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  routeToNewProduct() {
    let isUserLogin = localStorage.getItem("isLoggedIn");
    if (isUserLogin == "false") {
      this.loginFirst();
    }

    isUserLogin = localStorage.getItem("isLoggedIn");
    if (isUserLogin != "false") {
      this.router.navigate(["/new-product"]);
    }
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

  userListing() {
    this.router.navigate(["/myListing"]);
  }

  openCart() {
    console.log("open cart");
    const dialogRef = this.dialog.open(ShoppingCartComponent, {
      width: "600px", // Adjust as needed
      position: {
        right: "0",
        top: "0",
      },
      panelClass: "custom-dialog-panel",
    });

    dialogRef.afterClosed().subscribe((result) => {
      // handle result
    });
  }

  goToFavorites() {
    this.router.navigate(["myListing/favorite"]);
  }

  goToBuyOrders() {
    this.router.navigate(["myListing/buy/order"]);
  }

  goToSellOrders() {
    this.router.navigate(["myListing/sell/order"]);
  }

  goToMyListings() {
    this.router.navigate(["myListing/listing"]);
  }

  goToCart() {
    this.router.navigate(["/myListing"], {
      state: {
        activeRouteType: "cart",
      },
    });
  }
}
