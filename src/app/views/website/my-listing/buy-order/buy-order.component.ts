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
  isLoading: boolean = true;
  private refreshInterval: any;

  constructor(private http:HttpService,private router:Router){}

  ngOnInit(): void {
    this.getBuyOrders()

    this.refreshInterval = setInterval(() => {
      this.getBuyOrders();
    }, 10000);
  }

  ngOnDestroy(): void {
    // Clear interval when component is destroyed to avoid memory leaks
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  getBuyOrders() {
    this.isLoading = true;
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
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
    });
  }

  detailsBuyListing(listing: any) {
    this.router.navigate(['/myListing/buy/order/details'], { queryParams: { id: listing.id } });
  }

}
