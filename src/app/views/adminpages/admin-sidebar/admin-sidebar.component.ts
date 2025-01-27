import { Component,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';

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
    // FeeManagement: {
    //   label: 'FeeManagement',
    //   router: '/Fee-Management',
    //   routerActive: 'navbar-button-active',
    // },
    // AcadmeyBooking: {
    //   label: 'AcadmeyBooking',
    //   router: '/booking-Page',
    //   routerActive: 'navbar-button-active',
    //   icon: 'assets/images/add-plus-square-svgrepo-com.svg',
    //   iconWidth: 20,
    //   iconHeight: 20,
    // },
    // ProductInventory: {
    //   label: 'Product-Inventory',
    //   router: '/inventory-Page',
    //   routerActive: 'navbar-button-active',
    //   icon: 'assets/images/cart-plus-svgrepo-com.svg',
    //   iconWidth: 20,
    //   iconHeight: 20,
    // },
    // SaleProduct: {
    //   label: 'sale-product',
    //   router: '/salesProduct-Page',
    //   routerActive: 'navbar-button-active',
    // },
  };

  isActive(route: string): boolean {
    return this.route.url.includes(route);
  }

  constructor(
    public route: Router,
    private translateService: TranslateService,
    private router: Router,
    public alertService: AlertsServicesService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
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
}
