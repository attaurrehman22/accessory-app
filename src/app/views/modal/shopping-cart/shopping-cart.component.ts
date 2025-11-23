import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit{
  apiUrl = environment.apipath + "/";
  constructor(private router: Router,private http: HttpService,private alertService: AlertsServicesService) {}

  ngOnInit(): void {
    this.getCartList();
  }

  cartItems:any[] = [];
  lugWidth=[];
  Buckle=[];
  Length=[];
  Color:any;
  getCartList() {
    this.http.getCartList().subscribe((res) => {
      if(res?.items?.length > 0){
        this.cartItems = res.items;
        this.cartItems = this.cartItems.map((item: any) => {
          item.accessory.main_image = item.accessory.main_image.replace(/\\/g, "");
          return item;
        });

        this.Buckle = res?.items[0]?.accessory?.inventories[0]?.attribute_values;

        this.Length = res?.items[0]?.accessory?.inventories;

        this.Color = res?.items[0]?.accessory?.inventories[0]?.attribute_values;
      
        Object.values(res?.items[0]?.accessory?.attributes || {}).forEach(attrObj => {
          if (attrObj && typeof attrObj === 'object') {
            this.lugWidth.push(...Object.keys(attrObj));
          }
        });
       
      }
    });
    console.log(this.cartItems);
  }

  goToCart() {
    this.router.navigate(['/myprofile'], 
      { 
        state: {
          activeRouteType: 'cart'
        }
       });
  }

  goToCheckout() {
    // this.http.confirmCartOrder().subscribe((res) => {
    //   this.alertService.showAlert("success", "Order confirmed");
    // });
    this.router.navigate(['/myprofile/summary'])
  }
}
