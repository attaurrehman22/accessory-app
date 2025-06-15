import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { SidebarService } from 'src/services/sidebar.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit{
  toogle: boolean = true;

  accessoriesRoutes:any;

  isActive(route: string): boolean {
    return this.route.url.includes(route);
  }

  constructor(
    public route: Router,
    private translateService: TranslateService,
    private router: Router,
    public alertService: AlertsServicesService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();

    this.accessoriesRoutes = [
        '/admin/accessories',
        '/admin/accessory/categories',
        '/admin/group',
        '/admin/sub-group',
        '/admin/attributes',
        '/admin/attribute-values',
        '/admin/inventory',
        '/admin/attribute-listing',
        '/admin/images-listing'
      ];

     this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateAccRouteVisibility(event.urlAfterRedirects);
      });

        
  }

  checkScreenSize() {
    if (window.innerWidth <= 660) {
      this.toogle = false;
    } else {
      this.toogle = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  logout() {

  }

  isDeveloper(): boolean {
     return true;
  }

  onToogleHandler(): void {
    this.toogle = !this.toogle;
  }

  isAccRoutShow:boolean=false;

onMenuItemClick() {
  this.sidebarService.emitSidebarClick();
  // this.updateAccRouteVisibility();
}

// updateAccRouteVisibility(): void {
//   console.log("this.router.url",this.router.url)
//   console.log("this.router",this.router)
//   console.log("!this.accessoriesRoutes.some(route => this.router.url.includes(route))",this.accessoriesRoutes.some(route => this.router.url.includes(route)))
//   this.isAccRoutShow = this.accessoriesRoutes.some(route => this.router.url.includes(route));
// }

 updateAccRouteVisibility(currentUrl: string): void {
    console.log('currentUrl:', currentUrl);
    this.isAccRoutShow = this.accessoriesRoutes.some(route => currentUrl.includes(route));
  }


onMenuItemClickOfAccee() {
  this.isAccRoutShow = true; // because it's an accessories route
  this.sidebarService.emitSidebarClick();
  // this.updateAccRouteVisibility()
}

}
