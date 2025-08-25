import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { HoverStateService } from 'src/app/views/services/shared-blured-modal-service/hover-state.service';
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
  showSellerProofofShipping: boolean = false;
  trackingID: any;
  logisticsPartner: any;

  constructor(private route: ActivatedRoute,private hoverStateService: HoverStateService,
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
          return order.id == this.listingID || order.product.id == this.listingID;  // ✅ must return
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
                  this.statuses[1].time = moment(history.created_at).fromNow();
                  if(res?.data?.history.some(msg => msg.new_status === 'order_sold') || res?.data?.history.some(msg => msg.new_status === 'order_canceled') ){
                    this.statuses[2].active = false;
                  }else{
                    this.statuses[2].active = true;
                  }
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
                if (history.new_status == 'order_sold') {
                  this.statuses[2].active = false;
                  this.statuses[8].active = true;
                  this.statuses[8].time = moment(history.created_at).fromNow();
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
      if (this.orderDetails?.shipping_proof) {
        // Parse the string into an array
        let proofs: string[] = JSON.parse(this.orderDetails.shipping_proof);
      
        // Remove escape slashes if any (safety check)
        proofs = proofs.map(p => p.replace(/\\/g, ""));
    
      
        // Build full URLs for preview
        this.imagePreviews = proofs.map(p => this.apiUrl + p);
      }
    
      if(this.orderDetails?.shipping_tracking_id){
        this.trackingID = this.orderDetails?.shipping_tracking_id
      }

      if(this.orderDetails?.shipping_partner){
        this.logisticsPartner = this.orderDetails?.shipping_partner
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

  showBuyerToConfirmOrderDeliveres:boolean = false;

  // this.showBuyerMakePayment = false;
  // this.showBuyerMakePayment = false;
  // this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = false;
  // this.showBuyerToConfirmOrderDeliveres = false;
  isHoverModel: boolean = false
  callBuyerOption(i:any){
    console.log("Buyer Production",i)
    console.log("this.activeBuyerStatuses.length",this.activeBuyerStatuses.length)
    if(i == 2 && this.activeBuyerStatuses.length == 3){
      this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = false;
      this.showBuyerToConfirmOrderDeliveres = false;
      this.showBuyerMakePayment = true;
      this.isHoverModel = true
    }else if(i == 3 && this.activeBuyerStatuses.length >= 5){
      this.showBuyerToConfirmOrderDeliveres = false;
       this.showBuyerMakePayment = false;
       this.showBuyerMakePayment = false;
      this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = true;
      this.isHoverModel = true
    }else if(i == 4 && this.activeBuyerStatuses.length == 5){
      this.showBuyerMakePayment = false;
      this.showBuyerMakePayment = false;
      this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = false;
      this.showBuyerToConfirmOrderDeliveres = true;
      this.isHoverModel = true
    }
    else if(i == 4 && this.activeBuyerStatuses.length >= 5){
      this.showBuyerMakePayment = false;
      this.showBuyerMakePayment = false;
      this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = false;
    }
    else{
      this.showBuyerMakePayment = false;
    }
    this.hoverStateService.setHoverState(this.isHoverModel);
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

  get totalPrice(): number {
    const shipPrice = Number(this.backUpSelectedProductWhenBuyandSellitemClicked?.order?.offer?.ship_price || 0);
    const finalPrice = Number(this.backUpSelectedProductWhenBuyandSellitemClicked?.order?.final_price || 0);
    return shipPrice + finalPrice;
  }

  buyerMakePayment() {
    let userIDD;
    if (localStorage.getItem("userID")) {
      userIDD = localStorage.getItem("userID").toString();
    }

    const formData = {
      chat_id: this.orderDetails?.chat_id,
      product_id: this.selectedProductDetails.id,
      receiver_id: this.backUpSelectedProductWhenBuyandSellitemClicked.order.product.created_by.id,
      action_type: "make_payment",
    };
    // console.log("receiver_id",receiver_id)
    this.http.sendMessage(formData).subscribe(
      (res) => {
        this.isHoverModel=false;
        this.hoverStateService.setHoverState(this.isHoverModel);
        this.showBuyerMakePayment = false;
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("success", "Payment Send Successfully");
        } else {
          this.alertService.showAlert("success", "تم إرسال العرض بنجاح");
        }
        this.fetchOrderStatus(this.orderID, "buyer");
      },
      (err) => {
        if (err && err.error) {
          this.alertService.showAlert("warning", `${err.error.message}`);
        } else {
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert(
              "warning",
              "Error in Making payment. Please try again"
            );
          } else {
            this.alertService.showAlert(
              "warning",
              "حدث خطأ أثناء إجراء الدفع. يرجى المحاولة مرة أخرى"
            );
          }
        }
      }
    );
  }

  cancelMakePayment(){
    this.isHoverModel=false;
    this.hoverStateService.setHoverState(this.isHoverModel);
    this.showBuyerMakePayment = false
  }


  conformOrderRecieved() {
    let userIDD;
    if (localStorage.getItem("userID")) {
      userIDD = localStorage.getItem("userID").toString();
    }
  
    const formData = {
      chat_id: this.orderDetails?.chat_id,
      product_id: this.selectedProductDetails.id,
      receiver_id: this.backUpSelectedProductWhenBuyandSellitemClicked.order.product.created_by.id,
      action_type: "order_delivered",
    };
  
    this.http.sendMessage(formData).subscribe(
      (res) => {
        this.isHoverModel=false;
        this.hoverStateService.setHoverState(this.isHoverModel);
        this.showBuyerToConfirmOrderDeliveres = false;
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("success", "Order confirmed as received successfully");
        } else {
          this.alertService.showAlert("success", "تم تأكيد استلام الطلب بنجاح");
        }
        this.fetchOrderStatus(this.orderID, "buyer");
      },
      (err) => {
        if (err && err.error) {
          this.alertService.showAlert("warning", `${err.error.message}`);
        } else {
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert(
              "warning",
              "Error in confirming order. Please try again"
            );
          } else {
            this.alertService.showAlert(
              "warning",
              "حدث خطأ أثناء تأكيد الطلب. يرجى المحاولة مرة أخرى"
            );
          }
        }
      }
    );
  }
  


  cancelOrderRecieved(){
    this.isHoverModel=false;
    this.hoverStateService.setHoverState(this.isHoverModel);
    this.showBuyerToConfirmOrderDeliveres =false
  }


  allowedExtensions = ["jpeg", "jpg", "png"];
  uploadedFiles: File[] = [];
  imagePreviews: string[] = [];
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const fileExt = file.name.split(".").pop().toLowerCase();
        if (this.allowedExtensions.includes(fileExt)) {
          this.uploadedFiles.push(file);
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagePreviews.push(e.target.result); // Save preview URL
          };
          reader.readAsDataURL(file);
        } else {
          alert("Only JPEG, JPG, and PNG files are allowed.");
        }
      }
    }
  }

  sendProofofShipMent() {
    if (this.uploadedFiles.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append("order_id", this.orderDetails.id);
    formData.append("shipping_tracking_id", this.trackingID);
    formData.append("shipping_partner", this.logisticsPartner);
    formData.append(
      "shipping_address",
      this.orderDetails.shipping_address || "ship xyz 123"
    );

    // Append multiple images as shipping_proof[]
    this.uploadedFiles.forEach((file) => {
      formData.append("shipping_proof[]", file);
    });

    this.http.createShipment(formData).subscribe(
      (res) => {
        this.isHoverModel=false;
        this.hoverStateService.setHoverState(this.isHoverModel);
        this.showSellerProofofShipping = false;
        this.fetchOrderStatus(this.orderID, "seller");
      },
      (err) => {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Error in sending Proof of ownership"
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "حدث خطأ أثناء إرسال إثبات الملكية"
          );
        }
      }
    );
  }

  formateTime(time: any) {
    const result = moment(time).fromNow(); // "in 3 days" or "3 days ago"
    return result.startsWith("in ") 
      ? result.replace("in ", "") + " left" 
      : result; 
  }

  cancelProofofShipMent() {
    this.isHoverModel=false;
    this.hoverStateService.setHoverState(this.isHoverModel);
    this.showSellerProofofShipping = false;
  }

  // Remove selected image
  removeImage(index: number) {
    this.uploadedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  closeshowBuyerandSellerProofOfOwnerShipReadOnlyModal(){
    this.isHoverModel=false;
    this.hoverStateService.setHoverState(this.isHoverModel);
    this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = false;
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
      {
        label: "Order Sold",
        time:null,
        description: "The seller has marked the item as sold.",
        active: false,
      },
    ];

}
