import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-my-listing-details',
  templateUrl: './my-listing-details.component.html',
  styleUrls: ['./my-listing-details.component.css']
})
export class MyListingDetailsComponent implements OnInit{
  menuItems = [
    { label: 'Personal Info', icon: 'bi bi-person' },
    { label: 'Shipping Address', icon: 'bi bi-credit-card' },
    { label: 'Messages', icon: 'bi bi-chat' },
    { label: 'My Listings', icon: 'bi bi-card-list' },
    { label: 'Buy Orders', icon: 'bi bi-cart' },
    { label: 'Sell Orders', icon: 'bi bi-basket' },
    { label: 'Security', icon: 'bi bi-shield-lock' },
    { label: 'Privacy', icon: 'bi bi-globe' },
    { label: 'My Subscriptions', icon: 'bi bi-box-arrow-in-right' },
    { label: 'Favorites', icon: 'bi bi-heart' },
    { label: 'Feedback', icon: 'bi bi-star' },
    { label: 'Help Center', icon: 'bi bi-question-circle' },
  ];
  listings: any[] = [];
  ngOnInit(): void {
    this.fetchListings();  
  }

  constructor(private http:HttpService,private router:Router){}

  fetchListings(): void {
     this.http.getMyProductsListing().subscribe(
      (res)=>{
        this.listings=res.data.map((detail: any) => {
          if (detail.main_image) {
            detail.main_image = detail.main_image.replace(/\\/g, "");
          }
          return detail;
        });

  
      }
     )
  }

  activeIndex: number = 0; // Default: First item is active
  setActive(index: number): void {
    this.activeIndex = index;
    if(this.activeIndex == 4){
      this.getBuyOrders()
    } else if(this.activeIndex == 5){
      this.getSellOrders()
    }
  }

  buyOrdersListings: any[] = [];

  getBuyOrders(){
    this.http.getBuyOrders().subscribe(
      (res)=>{
        this.buyOrdersListings = res.orders.map((detail: any) => {
          if (detail.product.main_image) {
            detail.product.main_image = detail.product.main_image.replace(/\\/g, "");
          }
          return detail;
        });
        console.log(res)
      }
    )
  }

  sellOrders: any[] = [];

  getSellOrders(){
    this.http.getSellOrders().subscribe(
      (res)=>{
        console.log(res)
        this.sellOrders = res.orders.map((detail: any) => {
          if (detail.product.main_image) {
            detail.product.main_image = detail.product.main_image.replace(/\\/g, "");
          }
          return detail;
        });
        console.log("this.sellOrders",this.sellOrders)
      }
    )
  }

  editListing(listing){
   this.router.navigate(['/new-product'],{
    state:{productID:listing.id}
   })
  }

  isShowSellOrdersListngDetails: boolean = false;
  isShowBuyOrdersListngDetails: boolean = false;
  sellerDetails: any = null;
  buyerDetails: any = null;
  
  detailListing(listing: any): void {
    this.isShowSellOrdersListngDetails = true;
    this.fetchOrderStatus(listing.id, 'seller');
  }
  
  detailsBuyListing(listing: any): void {
    this.isShowBuyOrdersListngDetails = true;
    this.fetchOrderStatus(listing.id, 'buyer');
  }
  
  fetchOrderStatus(orderID: number, type: 'seller' | 'buyer'): void {
    this.getOrderStatus(orderID).subscribe(
      (res) => {
        console.log('Order Status Details:', res);
        
        if (type === 'seller') {
          this.sellerDetails = res;
          if(res?.status_flow){
            if(res?.status_flow?.initiated){
              this.statuses[0].active = true;
            }
          }
        } else if (type === 'buyer') {
          this.buyerDetails = res;
        }
      },
      (error) => {
        console.error('Error fetching order status:', error);
      }
    );
  }
  
  getOrderStatus(orderID: number): Observable<any> {
    return this.http.getOrderStatus(orderID);
  }

  deleteListing(listing){

  }

  statuses = [
    { label: 'Order Initiated', description: 'Order has been initiated.', active: false },
    { label: 'Awaiting For Confirmation', description: 'Waiting for seller to confirm the order.', active: false },
    { label: 'Make Payment', description: 'Make a payment for your order.', active: false },
    { label: 'Preparing Shipment', description: 'Seller is preparing your order.', active: false },
    { label: 'Delivery in Progress', description: 'Click to track your order.', active: false },
    { label: 'Order Delivered', description: 'Authorize payout for your order.', active: false },
    { label: 'Order Completed', description: 'Your order has been completed successfully.', active: false }
  ];
}
