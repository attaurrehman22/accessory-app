import { Component, HostListener, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { marker as TRANSLATE_ME } from "@biesbjerg/ngx-translate-extract-marker";
import { NavigationEnd, Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { LoaderService } from "./loader.service";
import { SearchServiceService } from "src/services/search-service/search-service.service";
import { MessageServiceService } from "src/services/search-show-hide/message-service.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {

  routeToCom:any='dashboard';

  alertPositionStyle: any = {};

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateAlertPosition();
  }

  // Update alert position dynamically based on screen visibility
  updateAlertPosition() {
    const screenHeight = window.innerHeight; // Height of the visible screen area
    const scrollPosition = window.scrollY;  // Current scroll position
    const documentHeight = document.documentElement.scrollHeight; // Total document height

    // Calculate available space at the top and bottom
    const topSpace = scrollPosition;
    const bottomSpace = documentHeight - (scrollPosition + screenHeight);

    // Adjust the alert position based on where the user is currently on the page
    if (bottomSpace > screenHeight / 2) {
      this.setAlertPosition('fixed', '15px', 'auto', 'top');
    } else if (topSpace > screenHeight / 2) {
      this.setAlertPosition('fixed', '15px', 'auto', 'bottom');
    } else {
      // If screen space is insufficient, keep the alert in the center of the screen
      this.setAlertPosition('fixed', '50%', 'auto', 'center');
    }
  }

  // Method to dynamically set alert position
  setAlertPosition(position: string, top: string, left: string, bottom: string) {
    this.alertPositionStyle = {
      position: position,
      top: top,
      left: left,
      bottom: bottom,
      right: '15px',
      transform: position === 'fixed' ? 'translateY(-50%)' : 'none',
      zIndex: '99999',  // Ensure alert is visible on top of other content
    };
  }


  routeToSection(routeName){
    this.routeToCom=routeName
  }

  showHeader: boolean = true;
  showAdminHeader: boolean = true;
  showSecondFooter: boolean = true;
  hideaccessoriesHeader: boolean = false;

  routesToHideforAccessriesUser = [
   "/accessories/home",
   "accessories/details"
  ]

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
    "/admin/attribute-inventory"
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

    // this.isLoading$.subscribe(isLoading => {
    //   console.log('Loading Status:', isLoading);
    // });
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        this.hideaccessoriesHeader = this.routesToHideforAccessriesUser.includes(currentRoute);
        this.showHeader = !this.routesToHideforUser.includes(currentRoute);
        this.showAdminHeader =
          !this.routesToHideforAdmin.includes(currentRoute);
      }
    });
  }

  isLoading$ = this.loaderService.isLoading;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];

  constructor(
    private translateService: TranslateService,
    private router: Router,
    public alertService: AlertsServicesService,
    public loaderService: LoaderService,
    private searchShowHide:MessageServiceService
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
        this.showHeader = !this.routesToHideforUser.includes(currentRoute);
        this.showAdminHeader =
          !this.routesToHideforAdmin.includes(currentRoute);
      }
    });
  }

  useLang(lang: string) {
    this.translateService.use(lang);
  }

  triggerSuccessAlert() {
   if (this.translateService.currentLang == "en") {
  this.alertService.showAlert(
    "success",
    "Your operation was successful."
  );
} else {
  this.alertService.showAlert(
    "success",
    "تمت العملية بنجاح."
  );
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


  gotoLogin(){
    localStorage.removeItem('Logged')
    localStorage.removeItem('user_token')
    localStorage.removeItem('isAdminUser')
   this.router.navigate(['/login'])
  }


  closeSearchBox(){
     this.searchShowHide.sendMessage('true')
  }
}
