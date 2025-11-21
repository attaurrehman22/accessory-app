import { Component, HostListener, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { filter } from "rxjs/operators";
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
  isAccRoutShow: boolean = false;
  accessoriesRoutes: any;
  dashboardViewPermission = "admin.dashboard.view";
  productsViewPermission = "admin.products.view";
  brandsViewPermission = "admin.brands.view";
  categoryViewPermission = "admin.categories.view";
  usersViewPermission = "admin.users.view";
  watchOfTheDayViewPermission = "admin.watch.view";
  chronosouqUsersViewPermission = "admin.chronosouq-users.view";
  rolesViewPermission = "admin.roles.view";
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
    this.initializeAccessoriesRoutes();
    this.setupRouteListener();
    this.updateAccRouteVisibility(this.router.url);
  }

  private initializeAccessoriesRoutes(): void {
    this.accessoriesRoutes = [
      "/admin/accessories",
      "/admin/accessory/categories",
      "/admin/group",
      "/admin/sub-group",
      "/admin/attributes",
      "/admin/attribute-values",
      "/admin/inventory",
      "/admin/attribute-listing",
      "/admin/images-listing",
      "/admin/attribute-inventory",
    ];
  }

  private setupRouteListener(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateAccRouteVisibility(event.urlAfterRedirects);
      });
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

  toggleAccessoriesMenu(): void {
    this.isAccRoutShow = !this.isAccRoutShow;
    this.sidebarService.emitSidebarClick();
  }

  updateAccRouteVisibility(currentUrl: string): void {
    const isAccessoriesRoute = this.accessoriesRoutes.some((route) =>
      currentUrl.includes(route)
    );
    if (isAccessoriesRoute) {
      this.isAccRoutShow = true;
    } else {
      this.isAccRoutShow = false;
    }
  }

  isDeveloper(): boolean {
    return true;
  }

  logout() {
    // Implement logout functionality
  }
}
