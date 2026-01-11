import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { AdminSidebarComponent } from "../admin-sidebar/admin-sidebar.component";
import { LoginStateService } from "src/services/login-service/login-state.service";

@Component({
  selector: "app-admin-page-header",
  templateUrl: "./admin-page-header.component.html",
  styleUrl: "./admin-page-header.component.css",
})
export class AdminPageHeaderComponent {
  constructor(
    private translateService: TranslateService,
    private router: Router,
    public alertService: AlertsServicesService,
    private loginStateService: LoginStateService
  ) {}

  gotoLogin() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user_token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userID");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userType");
    localStorage.removeItem("permissions");
    localStorage.removeItem("roles");
    sessionStorage.clear();
    this.loginStateService.updateLoginStatus(false);
    localStorage.setItem("isAdmin", "false");
    this.router.navigateByUrl("login").then(() => {
      window.location.reload();
    });
  }
}
