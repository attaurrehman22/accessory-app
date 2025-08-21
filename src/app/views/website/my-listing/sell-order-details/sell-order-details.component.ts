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
  selector: 'app-sell-order-details',
  templateUrl: './sell-order-details.component.html',
  styleUrl: './sell-order-details.component.css'
})
export class SellOrderDetailsComponent implements OnInit {
  apiUrl = environment.apipath + "/";
  listingID: any;
  sellOrders: any;
  selectedSellOrderDetails: any;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  productDetails: any;
  orderID: any;
  offerHistoryDetails: any;
  SellerNameForDisplay: any;
  SellerCityForDisplay: any;
  forSendingProductID: any;
  chat_ID: any;
  orderDate: any;
  estimateDelivery: any;
  sellerImageName: any;
  activeSellerStatuses: any;
  selectedProductDetails: any;
  backUpSelectedProductWhenBuyandSellitemClicked: any;
  orderDetails: any;
  lengthTwoofSeller: boolean = false;
  isSellerDeliveryInprogress: boolean = false;
  hoveredStatus: any = null;
  closeTimeout: any;
  profileForm!: FormGroup;
  selectedProfileImage: File | null = null;

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
        city: res.city,
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

  profileFormSubmit() {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      const formData = new FormData();
      
      // Append all form fields to FormData
      Object.keys(this.profileForm.value).forEach(key => {
        if (key === 'profile_image' && this.selectedProfileImage) {
          formData.append('profile_image', this.selectedProfileImage);
        } else {
          formData.append(key, this.profileForm.get(key).value);
        }
      });

      this.http.saveProfilingInformation(formData).subscribe((res) => {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("success", "Profile Update Successfully");
        } else {
          this.alertService.showAlert("success", "تم تحديث الملف الشخصي بنجاح");
        }
        // Reset image selection after successful upload
        this.selectedProfileImage = null;
      });
    } else {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Please add form values");
      } else {
        this.alertService.showAlert("warning", "يرجى إضافة قيم النموذج");
      }
    }
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
    }
  }

  getSellOrders() {
    this.http.getSellOrders().subscribe((res) => {
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
    console.log("Listing Details", listing)
    this.offerHistoryDetails = []
    this.SellerNameForDisplay = listing.buyer.name;
    this.SellerCityForDisplay = listing.buyer.city;

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

    this.fetchOrderStatus(listing.id, "seller");
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


  getInitialsofUsername(name){
    if (!name) {
      return '';
    }

    const words = name.trim().split(' ');
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


  fetchOrderStatus(orderID: number, type: "seller" | "buyer"): void {

    this.getOrderStatus(orderID).subscribe(
      (res) => {

        let initiate_ = '';
        let awaiting_confirmation_ = '';
        let make_payment_ = '';
        let delivery_in_progress_ = '';
        let order_delivered_ = '';
        let preparing_shipment_ = '';
        let order_completed_ = '';
        let order_canceled_ = '';

        if (res?.data?.history) {
          res?.data?.history.forEach((history: any) => {
            if (history.new_status == 'initiated') {
              initiate_ = 'true';
              this.sellerStatuses[0].time = moment(history.created_at).fromNow();
            }
            if (history.new_status == 'awaiting_confirmation' || history.new_status == 'add_shipping') {
              awaiting_confirmation_ = 'true'
              this.sellerStatuses[1].time = moment(history.created_at).fromNow();
            }
            if (history.new_status == 'make_payment') {
              make_payment_ = 'true';
              this.sellerStatuses[2].time = moment(history.created_at).fromNow();
            }
            if (history.new_status == 'preparing_shipment') {
              preparing_shipment_ = 'true';
              this.sellerStatuses[3].time = moment(history.created_at).fromNow();
            }
            if (history.new_status == 'delivery_in_progress') {
              delivery_in_progress_ = 'true';
              this.sellerStatuses[4].time = moment(history.created_at).fromNow();
            }
            if (history.new_status == 'order_delivered') {
              order_delivered_ = 'true';
              this.sellerStatuses[5].time = moment(history.created_at).fromNow();
            }
            if (history.new_status == 'order_completed') {
              order_completed_ = 'true';
              this.sellerStatuses[6].time = moment(history.created_at).fromNow();
            }
            if (history.new_status == 'order_canceled') {
              order_canceled_ = 'true';
              this.sellerStatuses[7].time = moment(history.created_at).fromNow();
            }

          })
        }

        if (initiate_ && !awaiting_confirmation_ && !make_payment_) {
          this.lengthTwoofSeller = true;
        }

        if (delivery_in_progress_ && !order_delivered_) {
          console.log("isSellerDeliveryInprogress", this.isSellerDeliveryInprogress)
          this.isSellerDeliveryInprogress = true;
        }
        this.orderID = res?.data?.history[0]?.order_id;

        // Reset all to inactive
        this.sellerStatuses.forEach((s) => (s.active = false));

        if (res?.data?.history) {
          if (initiate_) {
            this.sellerStatuses[0].active = true;
            this.sellerStatuses[1].active = true;
          }
          if (awaiting_confirmation_) {
            this.sellerStatuses[1].active = true;
            this.sellerStatuses[2].active = true;
          }
          if (make_payment_) {
            this.sellerStatuses[2].active = true;
            this.sellerStatuses[3].active = true;
          }
          if (preparing_shipment_) {
            this.sellerStatuses[3].active = true;
            this.sellerStatuses[4].active = true;
          }
          if (delivery_in_progress_) {
            this.sellerStatuses[4].active = true;
            this.sellerStatuses[5].active = true;
          }
          if (order_delivered_) {
            this.sellerStatuses[5].active = true;
            this.sellerStatuses[6].active = true;
          }
          if (order_completed_) {
            this.sellerStatuses[6].active = true;
          }
          if (order_canceled_) {
            this.sellerStatuses[7].active = true;
          }
        }

        // 🔥 Filter only active statuses for display
        this.activeSellerStatuses = this.sellerStatuses.filter(
          (s) => s.active
        );

        this.selectedProductDetails = res?.data?.order?.product;
        const data = res?.data;

        // Parse shipping_proof into an array
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
        console.log("PROOF images", this.backUpSelectedProductWhenBuyandSellitemClicked?.order?.shipping_proof)
        this.selectedProductDetails.main_image = this.selectedProductDetails?.main_image.replace(/\\/g, "");
        this.offerHistory(res?.data?.order?.offer_id)
        this.getOrderDetails();
      },
      (error) => {
        console.error("Error fetching order status:", error);
      }
    );
  }

  offerHistory(orderID) {
    this.http.offerDetailsOfHistory(orderID).subscribe(
      (res) => {
        if (res?.history) {
          this.offerHistoryDetails = res.history
        } else {
          this.offerHistoryDetails = []
        }
      }, (err) => {
        this.offerHistoryDetails = []
      }
    )
  }

  getOrderDetails() {
    this.http.getOrderDetails(this.orderID).subscribe((res) => {
      this.orderDetails = res.order;
      if (this.orderDetails?.product?.main_image) {
        this.orderDetails.product.main_image =
          this.orderDetails.product.main_image.replace(/\\/g, "");
      }
    });
  }

  getOrderStatus(orderID: number): Observable<any> {
    return this.http.OrderHistory(orderID);
  }

  showSellerConfirmOrderAvailability: boolean = false;
  showSellerProofofShipping: boolean = false;
  showBuyerandSellerProofOfOwnerShipReadOnlyModal: boolean = false;
  callSellerOption(i: any) {
    console.log("this.activeSellerStatuses.length = ", this.activeSellerStatuses.length)
    console.log("i = ", i)
    if (this.lengthTwoofSeller && i == 1) {
      this.showSellerConfirmOrderAvailability = true;
    }
    if (i == 3 && this.activeSellerStatuses.length == 4) {
      this.showSellerProofofShipping = true
    }

    if (i == 4 && this.activeSellerStatuses.length >= 5) {
      this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = true;
    }
  }

  sellerStatuses = [
    {
      label: "Order Initiated",
      time: null,
      description: "Buyer has initiated the order.",
      active: false,
    },
    {
      label: "Confirm Order Availability",
      time: null,
      description: "Confirm availability for your listed order.",
      active: false,
    },
    {
      label: "Awaiting Payment",
      time: null,
      description: "Awaiting payment confirmation from buyer.",
      active: false,
    },
    {
      label: "Prepare Shipment",
      time: null,
      description: "Prepare shipment for your order.",
      active: false,
    },
    {
      label: "Delivery in Progress",
      time: null,
      description: "Click to track your order.",
      active: false,
    },
    {
      label: "Order Delivered",
      time: null,
      description: "Awaiting for buyer to authorize payment.",
      active: false,
    },
    {
      label: "Order Completed",
      time: null,
      description: "Your order has been completed successfully.",
      active: false,
    },
    {
      label: "Order canceled",
      time: null,
      description: "The order was canceled by the buyer.",
      active: false,
    },
  ];


  setActive() {
    this.router.navigate(['/myListing/sell/order'])
  }

  routeToChat() {
    console.log('this slectedProduct details', this.backUpSelectedProductWhenBuyandSellitemClicked)
    console.log("this.forSendingProductID", this.forSendingProductID)
    this.router.navigate(["/chat"], {
      state: { chatID: this.chat_ID, productID: this.forSendingProductID, chatRouteFrom: 'orderDetails', productDetailsFromOrder: this.backUpSelectedProductWhenBuyandSellitemClicked },
    });
  }
}
