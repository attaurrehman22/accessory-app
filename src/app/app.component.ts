import { Component, HostListener, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { marker as TRANSLATE_ME } from "@biesbjerg/ngx-translate-extract-marker";
import { NavigationEnd, Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { LoaderService } from "./loader.service";
import { SearchServiceService } from "src/services/search-service/search-service.service";
import { MessageServiceService } from "src/services/search-show-hide/message-service.service";
import { HttpService } from "src/services/http/http.service";
import mediumZoom from "medium-zoom";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  routeToCom: any = "dashboard";
  myThumbnail = "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg";
  myFullresImage =
    "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg";
  alertPositionStyle: any = {};

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.updateAlertPosition();
  }

  ngAfterViewInit() {
    mediumZoom("[data-zoomable]", {
      background: "#000",
      scrollOffset: 0,
    });
  }

  // Update alert position dynamically based on screen visibility
  updateAlertPosition() {
    // Always position at top-right for consistent UX
    // The alert will be fixed at the top-right corner
    this.setAlertPosition("fixed", "15px", "auto", "auto");
  }

  // Method to dynamically set alert position
  setAlertPosition(
    position: string,
    top: string,
    left: string,
    bottom: string
  ) {
    this.alertPositionStyle = {
      position: position,
      top: top,
      left: left,
      bottom: bottom,
      right: "15px",
      transform: "none", // No transform needed for top-right positioning
      zIndex: "99999", // Ensure alert is visible on top of other content
    };
  }

  routeToSection(routeName) {
    this.routeToCom = routeName;
  }

  showHeader: boolean = true;
  showAdminHeader: boolean = true;
  showSecondFooter: boolean = true;
  hideaccessoriesHeader: boolean = false;

  /** Same nav as home hero, on accessory routes outside `/` (e.g. product detail). */
  showAccessoryHeaderBar = false;

  /** Hide public footer when using admin layout (`/admin/...`). */
  isAdminRoute = false;

  routesToHideforAccessriesUser = [
    "/",
    "/accessories/home",
    "/accessories/details",
  ];

  routesToHideforUser = [
    "/admin/dashboard",
    "/admin/products",
    "/admin/add-product",
    "/admin/brands",
    "/admin/users",
    "/admin/brands-product",
    "/admin/category",
    "/admin/category-product",
    "/admin/watchOfDay",
    "/admin/accessories",
    "/admin/accessories/add",
    "/admin/top/brands",
    "/admin/accessory/categories",
    "/admin/group",
    "/admin/sub-group",
    "/admin/attributes",
    "/admin/attribute-values",
    "/admin/inventory",
    "/admin/attribute-listing",
    "/admin/images-listing",
    "/admin/attribute-inventory",
    "/admin/roles",
    "/admin/roles/create",
    "/admin/chronosouq-users",
    ,
    "/admin/reports",
    "/admin/report-details",
    "/admin/orders",
    "/admin/order-details",
  ];
  routesToHideforAdmin = [
    "/login",
    "/register",
    "/new-product",
    "/buy-product",
    "/product-list",
    "/product-detail",
    "/popular-brands-list",
  ];

  isAdminRouter: any = true;

  ngOnInit(): void {
    const val = TRANSLATE_ME("home.title");

    // Initialize alert position on component load
    this.updateAlertPosition();

    // Restore permissions if user is logged in but permissions are missing
    this.restorePermissionsIfNeeded();

    // this.isLoading$.subscribe(isLoading => {
    //   console.log('Loading Status:', isLoading);
    // });

    this.showAccessoryHeaderBar = this.computeAccessoryHeaderBar(this.router.url);
    this.isAdminRoute = this.computeIsAdminRoute(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        this.isAdminRoute = this.computeIsAdminRoute(currentRoute);
        this.showAccessoryHeaderBar =
          this.computeAccessoryHeaderBar(currentRoute);
        this.hideaccessoriesHeader =
          this.routesToHideforAccessriesUser.includes(currentRoute);
        // Check if route is admin route (starts with /admin/)
        const isAdminRoute = currentRoute.startsWith("/admin/");
        this.showHeader = isAdminRoute
          ? false
          : !this.routesToHideforUser.includes(currentRoute);
        this.showAdminHeader =
          !this.routesToHideforAdmin.includes(currentRoute);
      }
    });
  }

  /**
   * Restores user permissions from API if user is logged in but permissions are missing
   * This handles the case where sessionStorage was cleared but user is still authenticated
   */
  private restorePermissionsIfNeeded(): void {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userToken = localStorage.getItem("user_token");
    const storedPermissions = localStorage.getItem("permissions");

    // If user is logged in but permissions are missing, fetch them from API
    if (isLoggedIn && userToken && !storedPermissions) {
      this.http.gtUserDetails().subscribe(
        (response) => {
          if (response && response.user) {
            // Store permissions in localStorage
            if (
              response.user.permissions !== undefined &&
              response.user.permissions !== null
            ) {
              localStorage.setItem(
                "permissions",
                JSON.stringify(response.user.permissions)
              );
            }
            // Store roles in localStorage
            if (
              response.user.roles !== undefined &&
              response.user.roles !== null
            ) {
              localStorage.setItem("roles", response.user.roles.join(","));
            }
            // Update admin status if needed
            const isAdmin = response.user.type === "chronosouq-user";
            if (isAdmin) {
              localStorage.setItem("isAdmin", "true");
            }
          }
        },
        (error) => {
          // Silently fail - user might not have valid token anymore
          console.error("Failed to restore permissions:", error);
        }
      );
    }
  }

  isLoading$ = this.loaderService.isLoading;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];

  constructor(
    private translateService: TranslateService,
    private router: Router,
    public alertService: AlertsServicesService,
    public loaderService: LoaderService,
    private searchShowHide: MessageServiceService,
    private http: HttpService
  ) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("en");

    const browserlang = this.translateService.getBrowserLang();
    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        // Check if route is admin route (starts with /admin/)
        const isAdminRoute = currentRoute.startsWith("/admin/");
        this.showHeader = isAdminRoute
          ? false
          : !this.routesToHideforUser.includes(currentRoute);
        this.showAdminHeader =
          !this.routesToHideforAdmin.includes(currentRoute);
      }
    });
  }

  private computeAccessoryHeaderBar(url: string): boolean {
    const path = url.split("?")[0];
    if (path.startsWith("/admin/")) {
      return false;
    }
    if (path === "/myprofile/summary") {
      return true;
    }
    // show also on register and login pages
    if (path === "/login" || path === "/register") {
      return true;
    }
    return path.startsWith("/accessories/") && path !== "/accessories/home";
  }

  private computeIsAdminRoute(url: string): boolean {
    return url.split("?")[0].startsWith("/admin/");
  }

  useLang(lang: string) {
    this.translateService.use(lang);
  }

  triggerSuccessAlert() {
    if (this.translateService.currentLang == "en") {
      this.alertService.showAlert("success", "Your operation was successful.");
    } else {
      this.alertService.showAlert("success", "تمت العملية بنجاح.");
    }
  }

  // Method to trigger danger alert
  triggerDangerAlert() {
    if (this.translateService.currentLang == "en") {
      this.alertService.showAlert(
        "warning",
        "Something went wrong. Please try again."
      );
    } else {
      this.alertService.showAlert(
        "warning",
        "حدث خطأ ما. يرجى المحاولة مرة أخرى."
      );
    }
  }

  // Method to clear alert
  closeAlert() {
    this.alertService.clearAlert();
  }

  gotoLogin() {
    localStorage.removeItem("Logged");
    localStorage.removeItem("user_token");
    localStorage.removeItem("isAdminUser");
    localStorage.removeItem("permissions");
    localStorage.removeItem("roles");
    sessionStorage.clear();
    this.router.navigate(["/login"]);
  }

  closeSearchBox() {
    this.searchShowHide.sendMessage("true");
  }
}
