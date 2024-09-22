import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
      router: '/admin-portal',
      routerActive: 'navbar-button-active',
      // icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    Products: {
      label: 'Products',
      router: '/admin-products',
      routerActive: 'navbar-button-active',
      // icon: 'assets/images/dashboard-2-svgrepo-com (1).svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    // Player: {
    //   label: 'Player',
    //   router: '/Player-Page',
    //   routerActive: 'navbar-button-active',
    //   icon: 'assets/images/american-football-player-svgrepo-com (1).svg',
    //   iconWidth: 20,
    //   iconHeight: 20,
    // },
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

  constructor(public route: Router) {}

  ngOnInit(): void {
    if (window.screen.width <= 575) {
      this.toogle = false;
    }
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
