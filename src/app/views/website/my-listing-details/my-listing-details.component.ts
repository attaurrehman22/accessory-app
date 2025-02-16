import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'src/services/http/http.service';
import { ModelLoginComponent } from '../../auth/model-login/model-login.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';

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
  userID:any;
  ngOnInit(): void {
  this.userID=localStorage.getItem('userID')
  if(!this.userID){
    this.loginFirst()
  }
    this.fetchListings();  
  }

  orderDetails:any

  getOrderDetails(){
    this.http.getOrderDetails(this.orderID).subscribe(
      (res)=>{
           this.orderDetails=res.order;
           this.orderDetails.product.main_image = this.orderDetails.product.main_image.replace(/\\/g, "");
      }
     )
  }

   loginFirst() {
      const dialogRef = this.dialog.open(ModelLoginComponent, {
        width: "600px",
        data: { message: "dialog-box" },
        disableClose: true,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
        }
      });
    }

  constructor(private http:HttpService,private router:Router,private dialog: MatDialog,private alertService:AlertsServicesService){}

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
    this.isShowSellOrdersListngDetails=false
    this.isShowBuyOrdersListngDetails=false
    this.showSellerConfirmOrderAvailability=false;

    this.sellerStatuses[0].active = false;
    this.sellerStatuses[1].active = false;
    this.sellerStatuses[2].active = false;
    this.sellerStatuses[3].active = false;
    this.sellerStatuses[4].active = false;
    this.sellerStatuses[5].active = false;
    this.sellerStatuses[6].active = false;


    this.statuses[0].active = false;
    this.statuses[1].active = false;
    this.statuses[2].active = false;
    this.statuses[3].active = false;
    this.statuses[4].active = false;
    this.statuses[5].active = false;
    this.statuses[6].active = false;


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
      }
    )
  }

  sellOrders: any[] = [];

  getSellOrders(){
    this.http.getSellOrders().subscribe(
      (res)=>{
        this.sellOrders = res.orders.map((detail: any) => {
          if (detail.product.main_image) {
            detail.product.main_image = detail.product.main_image.replace(/\\/g, "");
          }
          return detail;
        });
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
  productDetails:any;
  orderID:any;
  orderDate:any;
  estimateDelivery:any;
  
  detailListing(listing: any): void {
    this.isShowSellOrdersListngDetails = true;
    this.orderID=listing?.id;
    this.orderDate=listing?.status_updated_at;
    this.estimateDelivery=listing?.status_updated_at;
    this.productDetails=listing.product;
    if(this.productDetails?.main_image){
      this.productDetails.main_image=  this.productDetails.main_image.replace(/\\/g, "");
    }
 
      
    this.fetchOrderStatus(listing.id, 'seller');
  }

  // existingProductUserID:any;
  
  detailsBuyListing(listing: any): void {
    this.isShowBuyOrdersListngDetails = true;
    this.orderID=listing?.id
    this.productDetails=listing.product;
    this.orderDate=listing?.status_updated_at;
    this.estimateDelivery=listing?.status_updated_at;
    // this.existingProductUserID=this.productDetails.created_by.id
    if(this.productDetails?.main_image){
      this.productDetails.main_image=  this.productDetails.main_image.replace(/\\/g, "");
    }
    this.fetchOrderStatus(listing.id, 'buyer');
  }

  lengthTwoofSeller:boolean=false;
  isSellerDeliveryInprogress:boolean=false;

  fetchOrderStatus(orderID: number, type: 'seller' | 'buyer'): void {
    this.getOrderStatus(orderID).subscribe(
      (res) => {
        
        if (type === 'seller') {
           if(res?.status_flow?.initiated && res?.status_flow?.awaiting_confirmation && !res?.status_flow?.make_payment){
             this.lengthTwoofSeller=true
           }

           if(res?.status_flow?.delivery_in_progress && !res?.status_flow?.order_delivered){
            this.isSellerDeliveryInprogress=true
          }

          this.sellerDetails = res;
          this.orderID=res.order_id;
          if(res?.status_flow){
            if(res?.status_flow?.initiated){
              this.sellerStatuses[0].active = true;
            }
            if(res?.status_flow?.awaiting_confirmation){
              this.sellerStatuses[1].active = true;
            }
            if(res?.status_flow?.make_payment){
              this.sellerStatuses[2].active = true;
            }
            if(res?.status_flow?.preparing_shipment){
              this.sellerStatuses[3].active = true;
            }
            if(res?.status_flow?.delivery_in_progress){
              this.sellerStatuses[4].active = true;
            }
            if(res?.status_flow?.order_delivered){
              this.sellerStatuses[5].active = true;
            }
            if(res?.status_flow?.order_completed){
              this.sellerStatuses[6].active = true;
            }
          }
        } else if (type === 'buyer') {
          this.buyerDetails = res;
          if(res?.status_flow){
            if(res?.status_flow?.initiated){
              this.statuses[0].active = true;
            }
            if(res?.status_flow?.awaiting_confirmation){
              this.statuses[1].active = true;
            }
            if(res?.status_flow?.make_payment){
              this.statuses[2].active = true;
            }
            if(res?.status_flow?.preparing_shipment){
              this.statuses[3].active = true;
            }
            if(res?.status_flow?.delivery_in_progress){
              this.statuses[4].active = true;
            }
            if(res?.status_flow?.order_delivered){
              this.statuses[5].active = true;
            }
            if(res?.status_flow?.order_completed){
              this.statuses[6].active = true;
            }
          }
        }
        this.getOrderDetails()
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

  showSellerConfirmOrderAvailability:boolean=false;
  showSellerProofofShipping:boolean=false;

  callSellerOption(){
    if(this.lengthTwoofSeller){
      this.showSellerConfirmOrderAvailability=true;
    }
    if(this.isSellerDeliveryInprogress){
       this.showSellerProofofShipping=true
    }
  }

  shippingCharges:any;
  offerValidity:any;

  sendSellerOffer(){
    console.log("Function calling")
    let userIDD;
    if(localStorage.getItem("userID")){
      userIDD = localStorage.getItem("userID").toString();
    }
    
    const formData = {
      product_id: this.orderDetails.product_id || 0,
      sender_id: userIDD || 0,
      offer_id: Number(this.orderDetails.offer_id) || 0,
      // offer_price: Number(this.orderDetails.final_price) || 0,
      ship_price: this.shippingCharges || 0,
      // Safely handle null or undefined chat_id
      chat_id: this.orderDetails.chat_id ? this.orderDetails.chat_id.toString() : '0', // Fallback to '0' if null/undefined
      validity_days: this.offerValidity || 0,
    };
    

  console.log("formData",formData)
 
    this.http.sendOffer(formData).subscribe(
      (res) => {
        this.alertService.showAlert(
          "success",
          "offer Send Succesfully"
        );

      },
      (err) => {
        const errorMessage = err.error?.message || "Something went wrong!";
        this.alertService.showAlert("warning",errorMessage);
      }
    );
  }

  markAsSold(){
    // const formData = {
    //   offer_id: this.offerID,
    //   product_id:this.offerDetails.product.id,
    //   action_type: "mark_sold",
    //   chat_id:this.offerDetails.chat_id,
    //   receiver_id:this.offerDetails.sender_id,
    //   sender_id:localStorage.getItem("userID")
    // };
    // this.http.sendMessage(formData).subscribe(
    //   (res) => {
    //     this.alertService.showAlert(
    //       "success",
    //       "Product Mark as Sold Succesfully"
    //     );
    //     // this.dialogRef.close(this.offerForm.value);
    //   },
    //   (err) => {
    //     this.alertService.showAlert("danger", "Error in Product Mark as Sold");
    //   }
    // );
  }

  cancelSellerOffer(){
    this.showSellerConfirmOrderAvailability=false
  }

  trackingID:any;
  logisticsPartner:any;
  uploadedFiles: File[] = [];
  imagePreviews: string[] = [];
  allowedExtensions = ['jpeg', 'jpg', 'png'];

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const fileExt = file.name.split('.').pop().toLowerCase();
        if (this.allowedExtensions.includes(fileExt)) {
          this.uploadedFiles.push(file);
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagePreviews.push(e.target.result); // Save preview URL
          };
          reader.readAsDataURL(file);
        } else {
          alert('Only JPEG, JPG, and PNG files are allowed.');
        }
      }
    }
  }

  // Remove selected image
  removeImage(index: number) {
    this.uploadedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  sendProofofShipMent() {
    if (this.uploadedFiles.length === 0) {
      console.log('No files selected.');
      return;
    }

    const formData = new FormData();
    formData.append('order_id', this.orderDetails.id);
    formData.append('shipping_tracking_id', this.trackingID);
    formData.append('shipping_partner', this.logisticsPartner);
    formData.append('shipping_address', this.orderDetails.shipping_address || 'ship xyz 123');

    // Append multiple images as shipping_proof[]
    this.uploadedFiles.forEach((file) => {
      formData.append('shipping_proof[]', file); 
    });

    this.http.createShipment(formData).subscribe(
      (res)=>{
        this.showSellerProofofShipping=false;

      },(err)=>{
        this.alertService.showAlert('warning','Error in sending Proof of owner ship')
      }
    )

    console.log("formData",formData)
  } 


  cancelProofofShipMent(){
    this.showSellerProofofShipping=false
  }

  // for buyer
  statuses = [
    { label: 'Order Initiated', description: 'Order has been initiated.', active: false },
    { label: 'Awaiting For Confirmation', description: 'Waiting for seller to confirm the order.', active: false },
    { label: 'Make Payment', description: 'Make a payment for your order.', active: false },
    { label: 'Preparing Shipment', description: 'Seller is preparing your order.', active: false },
    { label: 'Delivery in Progress', description: 'Click to track your order.', active: false },
    { label: 'Order Delivered', description: 'Authorize payout for your order.', active: false },
    { label: 'Order Completed', description: 'Your order has been completed successfully.', active: false }
  ];

    // for Seller
    sellerStatuses = [
      { label: 'Order Received', description: 'Buyer has initiated the order.', active: false },
      { label: 'Confirm Order Availability', description: 'Confirm availability for your listed order.', active: false },
      { label: 'Awaiting Payment', description: 'Awaiting payment confirmation from buyer.', active: false },
      { label: 'Prepare Shipment', description: 'Prepare shipment for your order.', active: false },
      { label: 'Delivery in Progress', description: 'Click to track your order.', active: false },
      { label: 'Order Delivered', description: 'Awaiting for buyer to authorize payment.', active: false },
      { label: 'Payout Confirmation', description: 'Your payment has been released.', active: false }
    ];


}
