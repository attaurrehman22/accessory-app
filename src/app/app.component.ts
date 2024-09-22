import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { marker as TRANSLATE_ME } from "@biesbjerg/ngx-translate-extract-marker";
import { NavigationEnd, Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  showHeader: boolean = true;
  showAdminHeader: boolean = true;
  showSecondFooter: boolean = true;

  routesToHideforUser = ["/admin-portal", "/admin-products", "/admin-add-product","/admin-brands","/admin-brands-product","/admin-category","/admin-category-product"];
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
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        this.showHeader = !this.routesToHideforUser.includes(currentRoute);
        this.showAdminHeader = !this.routesToHideforAdmin.includes(currentRoute);
      }
    });
    console.log(" Title from marker ==> ", TRANSLATE_ME("home.title"));
  }

  supportLanguages = ["en", "ar", "fr", "ta", "hi"];

  constructor(
    private translateService: TranslateService,
    private router: Router,
    public alertService: AlertsServicesService
  ) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("en");

    const browserlang = this.translateService.getBrowserLang();

    console.log("Browser Language => ", browserlang);

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }



    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        this.showHeader = !this.routesToHideforUser.includes(currentRoute);
        this.showAdminHeader = !this.routesToHideforAdmin.includes(currentRoute);
      }
    });
  }

  useLang(lang: string) {
    console.log("selected language ==> ", lang);
    this.translateService.use(lang);
  }

  triggerSuccessAlert() {
    this.alertService.showAlert("success", "Your operation was successful.");
  }

  // Method to trigger danger alert
  triggerDangerAlert() {
    this.alertService.showAlert(
      "danger",
      "Something went wrong. Please try again."
    );
  }

  // Method to clear alert
  closeAlert() {
    this.alertService.clearAlert();
  }
}
