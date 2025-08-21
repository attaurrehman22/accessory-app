import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-buy-order-details',
  templateUrl: './buy-order-details.component.html',
  styleUrl: './buy-order-details.component.css'
})
export class BuyOrderDetailsComponent implements OnInit{
  apiUrl = environment.apipath + "/";
  listingID: any;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  productDetails: any;
  sellOrders: any;
  selectedSellOrderDetails: any;
  offerHistoryDetails: any;
  SellerNameForDisplay: any;
  SellerCityForDisplay: any;
  forSendingProductID: any;
  chat_ID: any;
  orderDate: any;
  estimateDelivery: any;
  orderID: any;
  sellerImageName: any;
  activeBuyerStatuses: any[] = [];
  selectedProductDetails:any;
  backUpSelectedProductWhenBuyandSellitemClicked:any;
  showBuyerMakePayment: boolean = false;
  showBuyerandSellerProofOfOwnerShipReadOnlyModal:boolean = false;
  hoveredStatus: any = null;
  closeTimeout: any;
  profileForm!: FormGroup;

  constructor(private route: ActivatedRoute,
    private http: HttpService,
    private router: Router,
    private dialog: MatDialog,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private fb: FormBuilder
  ) {
    this.translateService.addLangs(this.supportLanguages);
    const savedLang = this.languageService.getCurrentLanguage();
    if (this.supportLanguages.includes(savedLang)) {
      this.translateService.use(savedLang);
    } else {
      const browserLang = this.translateService.getBrowserLang();
      this.currentLanguage = browserLang;

      if (this.supportLanguages.includes(browserLang)) {
        this.translateService.use(browserLang);
        this.languageService.setLanguage(browserLang);
      }
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      this.listingID = id
    });
    this.profileForm = this.fb.group({
      first_name: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      last_name: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      gender: ["", Validators.required],
      date_of_birth: ["", Validators.required],
      countryCode: ["KSA"],
      phone_number: ["", [Validators.required, Validators.pattern(/^5\d{8}$/)]],
      language: ["english", Validators.required],
      occupation: ["", [Validators.required, Validators.minLength(2)]],
      about_me: ["", [Validators.maxLength(300)]],
      email: ["", [Validators.required, Validators.email]],
      password: [""],
      profile_image: [""]
    });
    this.fetchProfiling();
    if (this.listingID) {
      this.getSellOrders()
    }
  }

  fetchProfiling() {
    this.http.getProfilingInformation().subscribe((res) => {
      this.profileForm.patchValue({
        first_name: res.first_name,
        last_name: res.last_name,
        gender: res.gender,
        city: res?.city,
        country: 'Saudi Arabia',
        date_of_birth: res.date_of_birth,
        phone_number: res.phone_number,
        language: res?.language,
        occupation: res?.occupation,
        about_me: res?.about_me,
        email: res?.email,
        profile_image: res?.profile_image?.replace(/\\/g, ""),
        password: res?.password,
      });
    });
  }

  getSellOrders() {
    this.http.getBuyOrders().subscribe((res) => {
      this.sellOrders = res.orders.map((detail: any) => {
        if (detail?.product?.main_image) {
          detail.product.main_image = detail.product.main_image.replace(/\\/g, "");
        }
        return detail;
      });
      console.log("sellOrders   ", this.sellOrders)
      // ✅ Use .find instead of .map
      this.selectedSellOrderDetails = this.sellOrders.filter(
        (order) => {
          console.log("Order ID", order.id, "Listing ID", this.listingID);
          return order.id == this.listingID;  // ✅ must return
        }
      );

      console.log("selectedSellOrderDetails   ", this.selectedSellOrderDetails)
      this.detailListing(this.selectedSellOrderDetails[0])
    });
  }


  detailListing(listing: any): void {
    this.offerHistoryDetails = []
    this.SellerNameForDisplay = listing?.buyer?.name;
    this.SellerCityForDisplay = listing?.buyer?.city;
    this.orderID = listing?.id;
    this.forSendingProductID = listing?.product_id;
    this.chat_ID = listing?.chat_id;
    this.orderDate = listing?.status_updated_at;
    this.estimateDelivery = listing?.status_updated_at;
    this.productDetails = listing.product;
    if (this.productDetails?.created_by?.profile_image) {
      this.productDetails.created_by.profile_image = this.productDetails.created_by.profile_image.replace(
        /\\/g,
        ""
      );
    }
    this.sellerImageName = this.productDetails?.created_by?.profile_image
    if (this.productDetails?.main_image) {
      this.productDetails.main_image = this.productDetails.main_image.replace(
        /\\/g,
        ""
      );
    }

    this.fetchOrderStatus(listing.id, "buyer");
  }

  fetchOrderStatus(orderID: number, type: "seller" | "buyer"): void {
    
    this.getOrderStatus(orderID).subscribe(
      (res) => {
          this.statuses.forEach((s) => (s.active = false));
          if(res?.data?.history){
            res?.data?.history.forEach(
              (history:any)=>{
                if (history.new_status == 'initiated') {
                  this.statuses[0].active = true;
                  this.statuses[1].active = true;
                  this.statuses[0].time = moment(history.created_at).fromNow();
                }
                if (history.new_status == 'awaiting_confirmation' || history.new_status == 'add_shipping') {
                  this.statuses[1].active = true;
                  this.statuses[2].active = true;
                  this.statuses[1].time = moment(history.created_at).fromNow();
                }
                if (history.new_status == 'make_payment') {
                  this.statuses[2].active = true;
                  this.statuses[3].active = true;
                  this.statuses[2].time = moment(history.created_at).fromNow();
                }
                if (history.new_status == 'preparing_shipment') {
                  this.statuses[3].active = true;
                  this.statuses[4].active = true;
                  this.statuses[3].time = moment(history.created_at).fromNow();
                }
                if (history.new_status == 'delivery_in_progress') {
                  this.statuses[4].active = true;
                  this.statuses[5].active = true;
                  this.statuses[4].time = moment(history.created_at).fromNow();
                }
                if (history.new_status == 'order_delivered') {
                  this.statuses[5].active = true;
                  this.statuses[6].active = true;
                  this.statuses[5].time = moment(history.created_at).fromNow();
                }
                if (history.new_status == 'order_completed') {
                  this.statuses[6].active = true;
                  this.statuses[6].time = moment(history.created_at).fromNow();
                }
                if (history.new_status == 'order_canceled') {
                  this.statuses[7].active = true;
                  this.statuses[7].time = moment(history.created_at).fromNow();
                }
              }
            )
          }
          this.activeBuyerStatuses = this.statuses.filter((s) => s.active);
        
        this.selectedProductDetails = res?.data?.order?.product;
        const data = res?.data;

        if (data?.order?.shipping_proof) {
          try {
            let proofs = JSON.parse(data.order.shipping_proof); // turns into ["shipping_proof/458/1754679496_689648c87fa28.png"]

            // If you just want to remove slashes completely:
            proofs = proofs.map((p: string) => p.replace(/\//g, ''));

            // Or if you just want the normal path without escape chars:
            // proofs = proofs.map((p: string) => p); // no need to replace anything

            data.order.shipping_proof = proofs;
          } catch (e) {
            console.error("Invalid shipping_proof format", e);
          }
        }

        this.backUpSelectedProductWhenBuyandSellitemClicked = data;
        this.selectedProductDetails.main_image = this.selectedProductDetails.main_image.replace(/\\/g, "");
        this.offerHistory(res?.data?.order?.offer_id)
        this.getOrderDetails();
      },
      (error) => {
        console.error("Error fetching order status:", error);
      }
    );
  }

  offerHistory(orderID){
    this.http.offerDetailsOfHistory(orderID).subscribe(
      (res)=>{
        if(res?.history){
          this.offerHistoryDetails = res.history
        }else{
          this.offerHistoryDetails = []
        }
      },(err)=>{
        this.offerHistoryDetails = []
      }
    )
  }

  orderDetails: any;

  getOrderDetails() {
    this.http.getOrderDetails(this.orderID).subscribe((res) => {
      this.orderDetails = res.order;
      if(this.orderDetails?.product?.main_image){
        this.orderDetails.product.main_image =
          this.orderDetails.product.main_image.replace(/\\/g, "");
      }
    });
  }

  
  getOrderStatus(orderID: number): Observable<any> {
    return this.http.OrderHistory(orderID);
  }

  onMouseEnter(status: any) {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
    this.hoveredStatus = status;
  }
  
  onMouseLeave() {
    this.closeTimeout = setTimeout(() => {
      this.hoveredStatus = null;
    }, 200); // 200ms delay gives time to move to modal
  }

  callBuyerOption(i:any){
    console.log("Buyer Production",i)
    console.log("this.activeBuyerStatuses.length",this.activeBuyerStatuses.length)
    if(i == 2 && this.activeBuyerStatuses.length == 3){
      this.showBuyerMakePayment = true;
    }else if(i == 4 && this.activeBuyerStatuses.length >= 5){
      this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = true;
    }else{
      this.showBuyerMakePayment = false;
    }
  }
 

  setActive(){
    this.router.navigate(['/myListing/buy/order'])
  }

  routeToChat() {
    console.log('this slectedProduct details',this.backUpSelectedProductWhenBuyandSellitemClicked)
    console.log("this.forSendingProductID",this.forSendingProductID)
    this.router.navigate(["/chat"], {
      state: { chatID: this.chat_ID, productID: this.forSendingProductID,chatRouteFrom:'orderDetails', productDetailsFromOrder: this.backUpSelectedProductWhenBuyandSellitemClicked},
    });
  }


  getInitials(name: string | undefined | null): string {
    if (!name) {
      return "";
    }
    // Split name by space and get first letters
    const words = name.trim().split(" ");
    // words ['']0: ""length: 1[[Prototype]]: Array(0)

    if (words?.length === 1 && words[0] !== "" && words[0] !== undefined && words[0] !== null ) {
      return words[0][0].toUpperCase();
    } else {
      if(this.profileForm.get('email').value){
        const emailWord = this.profileForm.get('email').value
        if(emailWord[0][0]){
          return emailWord[0][0].toUpperCase();
        }else{
          return
        }
      }
      // return (emailWord[0][0].toUpperCase());
      // return 'EM';
    }
  }

  getInitialsofUsername(name){
    if (!name) {
      return '';
    }

    const words = name?.trim().split(' ');
    console.log("words", words);
    if (words?.length === 1 && words[0] !== "") {
      return words[0][0].toUpperCase();
    } else {
      const emailWord =this.profileForm.get('email').value;
      if(emailWord){
        return emailWord[0][0].toUpperCase();
      }
      // return (emailWord[0][0].toUpperCase());
      // return 'EM';
    }
  }

    // for buyer
    statuses = [
      {
        label: "Order Initiated",
        time:null,
        description: "Order has been initiated.",
        active: false,
      },
      {
        label: "Awaiting For Confirmation",
        time:null,
        description: "Waiting for seller to confirm the order.",
        active: false,
      },
      {
        label: "Make Payment",
        time:null,
        description: "Make a payment for your order.",
        active: false,
      },
      {
        label: "Preparing Shipment",
        time:null,
        description: "Seller is preparing your order.",
        active: false,
      },
      {
        label: "Delivery in Progress",
        time:null,
        description: "Click to track your order.",
        active: false,
      },
      {
        label: "Payout Confirmation",
        time:null,
        description: "Your payment has been released.",
        active: false,
      },
      {
        label: "Order Delivered",
        time:null,
        description: "Authorize payout for your order.",
        active: false,
      },
      {
        label: "Order canceled",
        time:null,
        description: "Your order has been canceled.",
        active: false,
      },
    ];

}
