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
  isLoading: boolean = true;
  hasLoadedOnce: boolean = false;

  constructor(private route: ActivatedRoute, private hoverStateService: HoverStateService,
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

  intervalId: any;
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

      this.intervalId = setInterval(() => {
        this.getSellOrders();
      }, 10000);
    }
  }

  ngOnDestroy(): void {
    // Clear interval when component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
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

    if (words?.length === 1 && words[0] !== "" && words[0] !== undefined && words[0] !== null) {
      return words[0][0].toUpperCase();
    } else {
      if (this.profileForm.get('email').value) {
        const emailWord = this.profileForm.get('email').value
        if (emailWord[0][0]) {
          return emailWord[0][0].toUpperCase();
        } else {
          return
        }
      }
    }
  }

  getSellOrders() {
    this.http.getSellOrders().subscribe(
      (res) => {
        try {
          this.sellOrders = res.orders.map((detail: any) => {
            if (detail?.product?.main_image) {
              detail.product.main_image = detail.product.main_image.replace(/\\/g, "");
            }
            return detail;
          });
          console.log("sellOrders   ", this.sellOrders)

          if (this.sellOrders && this.sellOrders.length && this.sellOrders[0]?.buyer_id != localStorage.getItem('userID')) {
            this.buyerProfileDetails = this.sellOrders[0].buyer;
            if (this.buyerProfileDetails?.profile_image) {
              this.buyerProfileDetails.profile_image = this.buyerProfileDetails.profile_image.replace(/\\/g, '')
            }
          }
          console.log(" this.buyerProfileDetails", this.buyerProfileDetails)

          this.selectedSellOrderDetails = (this.sellOrders || []).filter(
            (order) => {
              console.log("Order ID", order.id, "Listing ID", this.listingID);
              return order.id == this.listingID;
            }
          );

          console.log("selectedSellOrderDetails   ", this.selectedSellOrderDetails)
          if (this.selectedSellOrderDetails && this.selectedSellOrderDetails.length) {
            this.detailListing(this.selectedSellOrderDetails[0])
          }
        } finally {
          this.isLoading = false;
          this.hasLoadedOnce = true;
        }
      },
      (err) => {
        console.error('Error loading sell orders', err);
        this.isLoading = false;
      }
    );
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


  getInitialsofUsername(name) {
    if (!name) {
      return '';
    }

    const words = name.trim().split(' ');
    console.log("words", words);
    if (words?.length === 1 && words[0] !== "") {
      return words[0][0].toUpperCase();
    } else {
      const emailWord = this.profileForm.get('email').value;
      if (emailWord) {
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
        let order_sold_ = '';
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
            if (history.new_status == 'order_sold') {
              order_sold_ = 'true';
              this.sellerStatuses[8].time = moment(history.created_at).fromNow();
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
            this.sellerStatuses[2].active = false;
            this.sellerStatuses[7].active = true;
          }
          if (order_sold_) {
            this.sellerStatuses[2].active = false;
            this.sellerStatuses[8].active = true;
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

  buyerProfileDetails:any;

  getOrderDetails() {
    this.http.getOrderDetails(this.orderID).subscribe((res) => {
      this.orderDetails = res.order;
      if (this.orderDetails?.product?.main_image) {
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

      if (this.orderDetails?.shipping_tracking_id) {
        this.trackingID = this.orderDetails?.shipping_tracking_id
      }

      if (this.orderDetails?.shipping_partner) {
        this.logisticsPartner = this.orderDetails?.shipping_partner
      }
    });
  }

  cancelProofofShipMent() {
    this.isHoverModel = false;
    this.hoverStateService.setHoverState(this.isHoverModel);
    this.showSellerProofofShipping = false;
  }

  allowedExtensions = ["jpeg", "jpg", "png"];
  uploadedFiles: File[] = [];
  imagePreviews: string[] = [];

  removeImage(index: number) {
    this.uploadedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
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
        this.isHoverModel = false;
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

  trackingID: any;
  logisticsPartner: any;

  getOrderStatus(orderID: number): Observable<any> {
    return this.http.OrderHistory(orderID);
  }

  showSellerConfirmOrderAvailability: boolean = false;
  showSellerProofofShipping: boolean = false;
  showBuyerandSellerProofOfOwnerShipReadOnlyModal: boolean = false;
  isHoverModel: boolean = false
  callSellerOption(i: any) {
    console.log("this.activeSellerStatuses.length = ", this.activeSellerStatuses.length)
    console.log("i = ", i)
    if (this.lengthTwoofSeller && i == 1) {
      this.showSellerProofofShipping = false
      this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = false;
      this.showSellerConfirmOrderAvailability = true;
      this.isHoverModel = true
    }
    if (i == 3 && this.activeSellerStatuses.length == 4) {
      this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = false;
      this.showSellerConfirmOrderAvailability = false;
      this.showSellerProofofShipping = true;
      this.isHoverModel = true;
    }

    if (i == 3 && this.activeSellerStatuses.length != 4) {
      this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = false;
      this.showSellerConfirmOrderAvailability = false;
      this.isHoverModel = false;
    }

    if (i == 4 && this.activeSellerStatuses.length >= 5) {
      this.showSellerConfirmOrderAvailability = false;
      this.showSellerProofofShipping = false
      this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = true;
      this.isHoverModel = true
    }

    this.hoverStateService.setHoverState(this.isHoverModel);
  }

  downloadInvoice() {
    window.print(); // simple print option — can be replaced with html2pdf.js later
  }
  showInvoice = false;

  hasDeliveredOrSoldStatus(): boolean {
    if (!this.activeSellerStatuses || this.activeSellerStatuses.length === 0) return false;
  
    return this.activeSellerStatuses.some(
      status =>
        status.label === 'Order Sold' || status.label === 'Order Delivered'
    );
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
    {
      label: "Order Sold",
      time: null,
      description: "You’ve marked the Item as sold.",
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

  shippingCharges: any;
  offerValidity: any;

  markAsSold() {
    const formData = {
      product_id:this.selectedProductDetails.id,
      action_type: "mark_sold",
      chat_id:this.orderDetails?.chat_id,
      receiver_id:this.backUpSelectedProductWhenBuyandSellitemClicked.order.buyer.id,
    };
    this.http.sendMessage(formData).subscribe(
      (res) => {
        this.isHoverModel = false;
        this.hoverStateService.setHoverState(this.isHoverModel);
        this.showSellerConfirmOrderAvailability =false
        this.alertService.showAlert(
          "success",
          "Product Mark as Sold Succesfully"
        );
        this.fetchOrderStatus(this.orderID, "seller");
        // this.dialogRef.close(this.offerForm.value);
      },
      (err) => {
        this.alertService.showAlert("warning", "Error in Product Mark as Sold");
      }
    );
  }

  sendSellerOffer() {
    let userIDD;
    if (localStorage.getItem("userID")) {
      userIDD = localStorage.getItem("userID").toString();
    }

    const formData = {
      chat_id: this.orderDetails?.chat_id,
      ship_price: this.shippingCharges,
      product_id: this.selectedProductDetails.id,
      sender_id: userIDD,
      receiver_id: this.orderDetails?.buyer_id,
      validity_days: this.offerValidity,
    };

    this.http.sendShipmenttoBuyer(formData).subscribe(
      (res) => {
        this.isHoverModel = false;
        this.hoverStateService.setHoverState(this.isHoverModel);
        this.showSellerConfirmOrderAvailability = false;
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("success", "Offer Sent Successfully");
        } else {
          this.alertService.showAlert("success", "تم إرسال العرض بنجاح");
        }
        this.fetchOrderStatus(this.orderID, "seller");
      },
      (err) => {
        const errorMessage = err.error?.message || "Something went wrong!";
        this.alertService.showAlert("warning", errorMessage);
      }
    );
  }

  cancelSellerOffer() {
    this.isHoverModel = false;
    this.hoverStateService.setHoverState(this.isHoverModel);
    this.showSellerConfirmOrderAvailability = false;
  }

  closeshowBuyerandSellerProofOfOwnerShipReadOnlyModal() {
    this.isHoverModel = false;
    this.hoverStateService.setHoverState(this.isHoverModel);
    this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = false;
  }
}
