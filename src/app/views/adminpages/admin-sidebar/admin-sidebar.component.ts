import { Component, HostListener, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { SidebarService } from "src/services/sidebar.service";
import { PermissionCheckService } from "../../services/permission-check.service";
@Component({
  selector: "app-admin-sidebar",
  templateUrl: "./admin-sidebar.component.html",
  styleUrls: ["./admin-sidebar.component.css"],
})
export class AdminSidebarComponent implements OnInit {
  toogle: boolean = true;
  constructor(
    public route: Router,
    private translateService: TranslateService,
    private router: Router,
    public alertService: AlertsServicesService,
    private sidebarService: SidebarService,
    private permissionCheckService: PermissionCheckService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
  }

  isActive(route: string): boolean {
    return this.route.url.includes(route);
  }

  checkScreenSize() {
    this.toogle = window.innerWidth > 660;
  }

  doPermissionCheck(permission: string): boolean {
    return this.permissionCheckService.checkPermission(permission);
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.checkScreenSize();
  }

  onToogleHandler(): void {
    this.toogle = !this.toogle;
  }

  onMenuItemClick(): void {
    this.sidebarService.emitSidebarClick();
  }

  isDeveloper(): boolean {
    return true;
  }

  logout() {
    // Implement logout functionality
  }
}
