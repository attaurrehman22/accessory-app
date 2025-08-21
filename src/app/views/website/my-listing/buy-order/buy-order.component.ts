import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-buy-order',
  templateUrl: './buy-order.component.html',
  styleUrl: './buy-order.component.css'
})
export class BuyOrderComponent implements OnInit{
  apiUrl = environment.apipath + "/";
  listingID: any;
  buyOrdersListings: any[] = [];

  constructor(private http:HttpService,private router:Router){}

  ngOnInit(): void {
    this.getBuyOrders()
  }

  getBuyOrders() {
    this.http.getBuyOrders().subscribe((res) => {
      this.buyOrdersListings = res.orders.map((detail: any) => {
        if (detail?.product?.main_image) {
          detail.product.main_image = detail.product.main_image.replace(
            /\\/g,
            ""
          );
        }
        return detail;
      });
    });
  }

  detailsBuyListing(listing: any) {
    console.log("listing", listing);
    console.log("listing ID", listing.id);
    this.router.navigate(['/myListing/buy/order/details'], { queryParams: { id: listing.id } });
  }

}
