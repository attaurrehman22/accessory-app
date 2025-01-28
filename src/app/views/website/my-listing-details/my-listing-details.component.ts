import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    // this.listings = [
    //   {
    //     id: '3354654654526',
    //     title: 'Rolex Speedmaster In A Good Condition But In Low Price',
    //     created: '1 day ago',
    //     status: 'In Process',
    //     statusClass: 'bg-warning text-dark',
    //   },
    //   {
    //     id: '3354654654526',
    //     title: 'Rolex Speedmaster In A Good Condition But In Low Price',
    //     created: '1 week ago',
    //     status: 'In Process',
    //     statusClass: 'bg-warning text-dark',
    //   },
    //   {
    //     id: '3354654654526',
    //     title: 'Rolex Speedmaster In A Good Condition But In Low Price',
    //     created: 'Oct 30, 2024',
    //     status: 'Delivered',
    //     statusClass: 'bg-success text-light',
    //   },
    //   {
    //     id: '3354654654526',
    //     title: 'Rolex Speedmaster In A Good Condition But In Low Price',
    //     created: 'Oct 30, 2024',
    //     status: 'Cancelled',
    //     statusClass: 'bg-danger text-light',
    //   },
    // ];
  }

  activeIndex: number = 0; // Default: First item is active
  setActive(index: number): void {
    this.activeIndex = index;
  }

  editListing(listing){
   this.router.navigate(['/new-product'],{
    state:{productID:listing.id}
   })
  }

  deleteListing(listing){

  }
}
