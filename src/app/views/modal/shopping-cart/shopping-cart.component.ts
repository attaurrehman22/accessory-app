import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  constructor(private router: Router,private http: HttpService,private alertService: AlertsServicesService) {}

  goToCart() {
    this.router.navigate(['/myListing'], 
      { 
        state: {
          activeRouteType: 'cart'
        }
       });
  }

  goToCheckout() {
    this.http.confirmCartOrder().subscribe((res) => {
      this.alertService.showAlert("success", "Order confirmed");
    });
  }
}
