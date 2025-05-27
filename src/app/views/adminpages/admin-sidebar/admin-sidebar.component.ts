import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { SidebarService } from 'src/services/sidebar.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  toogle: boolean = true;
  navItems = {
    dashboard: {
      label: 'Dashboard',
      router: '/admin/dashboard',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    addProduct: {
      router: '/admin/product/add',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    Products: {
      label: 'Products',
      router: '/admin/products',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    Brands: {
      label: 'Brands',
      router: '/admin/brands',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    Category: {
      label: 'Category',
      router: '/admin/category',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    Users: {
      label: 'Users',
      router: '/admin/users',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    WatchOfDay: {
      label: 'WatchOfDay',
      router: '/admin/watchOfDay',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    Accessories: {
      label: 'Accessories',
      router: '/admin/accessories',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    TopBrands: {
      label: 'Accessories',
      router: '/admin/top/brands',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
     AccessoriesCategories: {
      label: 'Accessoriy Categories',
      router: '/admin/accessory/categories',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    Group: {
      label: 'Accessoriy Categories Group',
      router: '/admina/group',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    Sub: {
      label: 'Accessoriy Categories Group',
      router: '/admin/sub-group',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    Attributes: {
      label: 'Attributes',
      router: '/admin/attributes',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    AttributeValues: {
      label: 'Attribute values',
      router: '/admin/attribute-values',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
     Inventory: {
      label: 'Inventory',
      router: '/admin/inventory',
      routerActive: 'navbar-button-active',
      icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
  };

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
    '/admin/inventory'
  ];

     this.updateAccRouteVisibility();
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
  this.updateAccRouteVisibility();
}

updateAccRouteVisibility(): void {
  // console.log("this.router.url",this.router.url)
  // console.log("this.router",this.router)
  // console.log("!this.accessoriesRoutes.some(route => this.router.url.includes(route))",this.accessoriesRoutes.some(route => this.router.url.includes(route)))
  this.isAccRoutShow = this.accessoriesRoutes.some(route => this.router.url.includes(route));
}


onMenuItemClickOfAccee() {
  this.isAccRoutShow = true; // because it's an accessories route
  this.sidebarService.emitSidebarClick();
  this.router.navigate(['/admin/accessories']);
}

}
