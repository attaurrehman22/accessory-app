import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { HttpService } from "src/services/http/http.service";
import { ModelLoginComponent } from "../../auth/model-login/model-login.component";
import { MatDialog } from "@angular/material/dialog";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/services/lang-service/language.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-my-listing-details",
  templateUrl: "./my-listing-details.component.html",
  styleUrls: ["./my-listing-details.component.css"],
})
export class MyListingDetailsComponent implements OnInit {
  apiUrl = environment.apipath + "/";
  profileForm!: FormGroup;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  maxDate: string = new Date().toISOString().split('T')[0];

  billing_address = new FormControl(null, [
    Validators.required,
    Validators.maxLength(120),
  ]);
  first_name = new FormControl(
    [],
    [Validators.required, Validators.maxLength(50)]
  );
  last_name = new FormControl("", [
    Validators.required,
    Validators.maxLength(50),
  ]);
  street = new FormControl("", [Validators.required, Validators.maxLength(80)]);
  street_line_2 = new FormControl("", [Validators.maxLength(80)]);
  zip_code = new FormControl("", [
    Validators.required,
    Validators.pattern("^[0-9]*$"),
    Validators.maxLength(9),
  ]);
  city = new FormControl("", [Validators.required, Validators.maxLength(50)]);
  country = new FormControl("", [
    Validators.required,
    Validators.maxLength(50),
  ]);
  state = new FormControl("", [Validators.required, Validators.maxLength(50)]);

  billingForm: FormGroup;

  menuItems = [
    {
      label: "Personal Info",
      arabicLabel: "المعلومات الشخصية",
      white_icon: "assets/images/white_profile.svg",
      black_icon: "assets/images/black_profile.svg",
    },
    {
      label: "Shipping Address",
      arabicLabel: "عنوان الشحن",
      black_icon: "assets/images/black_shipping_address.svg",
      white_icon: "assets/images/white_shipping_address.svg",
    },
    {
      label: "Messages",
      arabicLabel: "الرسائل",
      black_icon: "assets/images/black_chat.svg",
      white_icon: "assets/images/white_chat.svg",
    },
    {
      label: "My Listings",
      arabicLabel: "قوائمي",
      black_icon: "assets/images/black_mylisting.svg",
      white_icon: "assets/images/white_buy_sell.svg",
    },
    {
      label: "Buy Orders",
      arabicLabel: "طلبات الشراء",
      black_icon: "assets/images/black_buy_sell.svg",
      white_icon: "assets/images/white_buy_sell.svg",
    },
    {
      label: "Sell Orders",
      arabicLabel: "طلبات البيع",
      black_icon: "assets/images/black_buy_sell.svg",
      white_icon: "assets/images/white_buy_sell.svg",
    },
    {
      label: "Favorites",
      arabicLabel: "المفضلة",
      black_icon: "assets/images/black_favourites.svg",
      white_icon: "assets/images/white_favourites.svg",
    },
    {
      label: "Cart Items",
      arabicLabel: "المفضلة",
      black_icon: "assets/images/black_cartitems.svg",
      white_icon: "assets/images/white_cartitems.svg",
    },
    // { label: "Security", arabicLabel: "الأمان", icon: "bi bi-shield-lock" },
    // { label: "Privacy", arabicLabel: "الخصوصية", icon: "bi bi-globe" },
    // { label: "My Subscriptions", arabicLabel: "اشتراكاتي", icon: "bi bi-box-arrow-in-right" },
    // { label: "Feedback", arabicLabel: "التقييمات", icon: "bi bi-star" },
    // { label: "Help Center", arabicLabel: "مركز المساعدة", icon: "bi bi-question-circle" },
  ];

   getInitialsofUsername(name){
    if (!name) {
      return '';
    }

    const words = name.trim().split(' ');

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    } else {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  }

  listings: any[] = [];
  userID: any;
  ngOnInit(): void {
    this.userID = localStorage.getItem("userID");
    if (!this.userID) {
      this.loginFirst();
    }

    if (history?.state?.activeRouteType == "Favorites") {
      this.activeIndex = 6;
      this.setActive(this.activeIndex)
    }

    if (history?.state?.activeRouteType == "myListings") {
      this.activeIndex = 3;
    }

    if (history?.state?.activeRouteType == "buyOrders") {
      this.activeIndex = 4;
      this.getOrderDetails();
    }

    if (history?.state?.activeRouteType == "sellOrders") {
      this.activeIndex = 5;
      this.getOrderDetails();
    }

    if (history?.state?.Ordertype == "buy") {
      this.activeIndex = 4;
      this.isShowSellOrdersListngDetails = false;
      this.isShowBuyOrdersListngDetails = false;
      this.detailsBuyListing(history?.state?.data);
      this.getOrderDetails();
    }
    if (history?.state?.Ordertype == "sell") {
      this.activeIndex = 5;
      this.isShowSellOrdersListngDetails = false;
      this.isShowBuyOrdersListngDetails = false;
      this.detailListing(history?.state?.data);
      this.getOrderDetails();
    }
    this.fetchListings();
    this.billingForm = new FormGroup({
      billing_address: this.billing_address,
      first_name: this.first_name,
      last_name: this.last_name,
      street: this.street,
      street_line_2: this.street_line_2,
      zip_code: this.zip_code,
      city: this.city,
      country: this.country,
      state: this.state,
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
      // country: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      // city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      countryCode: ["KSA"],
      phone_number: ["", [Validators.required, Validators.pattern(/^5\d{8}$/)]], // Assuming KSA format without country code
      language: ["english", Validators.required],
      occupation: ["", [Validators.required, Validators.minLength(2)]],
      about_me: ["", [Validators.maxLength(300)]],
      email: ["", [Validators.required, Validators.email]],
      password: [""],
    });
    this.fetchProfiling();
  }

  fetchProfiling() {
    this.http.getProfilingInformation().subscribe((res) => {
      this.profileForm.patchValue({
        first_name: res.first_name,
        last_name: res.last_name,
        gender: res.gender,
        city: res.city,
        country: res.country,
        date_of_birth: res.date_of_birth,
        phone_number: res.phone_number,
        language: res?.language,
        occupation: res?.occupation,
        about_me: res?.about_me,
        email: res?.email,
        password: res?.password,
      });
    });
  }

  profileFormSubmit() {
    this.profileForm.markAllAsTouched();
    console.log("Form Values:", this.profileForm.value);
    if (this.profileForm.valid) {
      this.http
        .saveProfilingInformation(this.profileForm.value)
        .subscribe((res) => {
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert(
              "success",
              "Profile Update Successfully"
            );
          } else {
            this.alertService.showAlert(
              "success",
              "تم تحديث الملف الشخصي بنجاح"
            );
          }
        });
    } else {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Please add form values");
      } else {
        this.alertService.showAlert("warning", "يرجى إضافة قيم النموذج");
      }
    }
  }

  getBillingInformation() {
    this.http.getBillingInformation().subscribe(
      (res) => {
        this.billingForm.patchValue({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          street: res.data.street,
          street_line_2: res.data.street_line_2,
          zip_code: res.data.zip_code,
          city: res.data.city,
          billing_address: res.data.billing_address,
          country: res?.data?.country,
          state: res?.data?.state,
        });
      },
      (err) => {
        if (this.translateService.currentLang == "en") {
          // this.alertService.showAlert(
          //   "warning",
          //   "Error in Fetching Billing Information"
          // );
        } else {
          this.alertService.showAlert(
            "warning",
            "حدث خطأ أثناء جلب معلومات الفوترة"
          );
        }
      }
    );
  }

  submitBillingForm() {
    if (this.billingForm.invalid) {
      this.alertService.showAlert("warning", "Please fill all the fields");
    } else {
      this.http.saveBillingInformation(this.billingForm.value).subscribe(
        (res) => {
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert(
              "success",
              "Billing Information Saved Successfully"
            );
          } else {
            this.alertService.showAlert(
              "success",
              "تم حفظ معلومات الفوترة بنجاح"
            );
          }
        },
        (err) => {
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert(
              "warning",
              "Error in Saving Billing Information"
            );
          } else {
            this.alertService.showAlert(
              "warning",
              "حدث خطأ أثناء حفظ معلومات الفوترة"
            );
          }
        }
      );
    }
  }

  wishList: any;
  getWishList() {
    this.http.getWishList().subscribe((res) => {
      this.wishList = res?.data;
      this.fetchProductDetails();
    });
  }

  favoritesProductDetails: any[] = []; // Initialize as an empty array

  async fetchProductDetails() {
    for (const productId of this.wishList) {
      try {
        const res = await this.http.getProductsByID(productId).toPromise(); // Call the API with each product ID

        const productDetail = res.data; // Store the fetched details for this product

        if (productDetail.additional_images) {
          productDetail.additional_images = JSON.parse(
            productDetail.additional_images
          );
        }

        if (productDetail.main_image) {
          productDetail.main_image = productDetail.main_image.replace(
            /\\/g,
            ""
          );
        }

        this.favoritesProductDetails.push(productDetail); // Add the product details to the array
      } catch (err) {
        console.error(
          "Error fetching product details for ID " + productId,
          err
        );
      }
    }
  }

  startChat(product) {
    this.router.navigate(["/chat"], {
      state: { data: product },
    });
  }

  orderDetails: any;

  getOrderDetails() {
    this.http.getOrderDetails(this.orderID).subscribe((res) => {
      this.orderDetails = res.order;
      this.orderDetails.product.main_image =
        this.orderDetails.product.main_image.replace(/\\/g, "");
    });
  }

  loginFirst() {
    const dialogRef = this.dialog.open(ModelLoginComponent, {
      width: "600px",
      data: { message: "dialog-box" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  constructor(
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

  fetchListings(): void {
    this.http.getMyProductsListing().subscribe((res) => {
      this.listings = res.data.map((detail: any) => {
        if (detail.main_image) {
          detail.main_image = detail.main_image.replace(/\\/g, "");
        }
        return detail;
      });
    });
  }

  activeIndex: number = 0; // Default: First item is active
  setActive(index: number): void {
    console.log("Active index", this.activeIndex);
    this.activeIndex = index;
    this.isShowSellOrdersListngDetails = false;
    this.isShowBuyOrdersListngDetails = false;
    this.showSellerConfirmOrderAvailability = false;

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

    if (this.activeIndex == 4) {
      this.getBuyOrders();
    } else if (this.activeIndex == 5) {
      this.getSellOrders();
    } else if (this.activeIndex == 6) {
      console.log("this.activeIndex == 9");
      this.getWishList();
    } else if (this.activeIndex == 1) {
      this.getBillingInformation();
    } else if (this.activeIndex == 2) {
      this.getLatestMessages();
    }
  }

  chats: any;
  filteredChats: any;
  getLatestMessages() {
    this.http.getChatsWithLatestMessage().subscribe((res) => {
      this.chats = res.chats.map(
        (chat) => {
          chat.product.main_image = chat.product.main_image.replace(/\\/g, "/");
          return chat;
        },
        (err) => {
          if (err && err.error) {
            this.alertService.showAlert("warning", `${err.error.message}`);
          } else {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "warning",
                "Error in getting message Please try again"
              );
            } else {
              this.alertService.showAlert(
                "warning",
                "حدث خطأ أثناء جلب الرسالة، يرجى المحاولة مرة أخرى"
              );
            }
          }
        }
      );
      this.filteredChats = this.chats;
    });
  }

  buyOrdersListings: any[] = [];

  getBuyOrders() {
    this.http.getBuyOrders().subscribe((res) => {
      this.buyOrdersListings = res.orders.map((detail: any) => {
        if (detail.product.main_image) {
          detail.product.main_image = detail.product.main_image.replace(
            /\\/g,
            ""
          );
        }
        return detail;
      });
    });
  }

  sellOrders: any[] = [];

  getSellOrders() {
    this.http.getSellOrders().subscribe((res) => {
      this.sellOrders = res.orders.map((detail: any) => {
        if (detail.product.main_image) {
          detail.product.main_image = detail.product.main_image.replace(
            /\\/g,
            ""
          );
        }
        return detail;
      });
    });
  }

  editListing(listing) {
    this.router.navigate(["/new-product"], {
      state: { productID: listing.id },
    });
  }

  isShowSellOrdersListngDetails: boolean = false;
  isShowBuyOrdersListngDetails: boolean = false;
  sellerDetails: any = null;
  buyerDetails: any = null;
  productDetails: any;
  orderID: any;
  orderDate: any;
  estimateDelivery: any;
  chat_ID: any;
  forSendingProductID: any;
  SellerCityForDisplay: any;

  detailListing(listing: any): void {
    this.SellerNameForDisplay = listing.buyer.name;
    this.SellerCityForDisplay = listing.buyer.city;
    this.isShowSellOrdersListngDetails = true;
    this.orderID = listing?.id;
    this.forSendingProductID = listing?.product_id;
    this.chat_ID = listing?.chat_id;
    this.orderDate = listing?.status_updated_at;
    this.estimateDelivery = listing?.status_updated_at;
    this.productDetails = listing.product;
    if (this.productDetails?.main_image) {
      this.productDetails.main_image = this.productDetails.main_image.replace(
        /\\/g,
        ""
      );
    }

    this.fetchOrderStatus(listing.id, "seller");
  }

  getInitials(name: string | undefined | null): string {
    if (!name) {
      return "";
    }

    // Split name by space and get first letters
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    } else {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  }

  SellerNameForDisplay: any;

  // existingProductUserID:any;
  detailsBuyListing(listing: any): void {
    this.isShowBuyOrdersListngDetails = true;
    this.orderID = listing?.id;
    this.forSendingProductID = listing?.product_id;
    this.productDetails = listing.product;
    this.orderDate = listing?.status_updated_at || null;
    this.chat_ID = listing?.chat_id;
    this.estimateDelivery = listing?.status_updated_at || null;
    // this.existingProductUserID=this.productDetails.created_by.id
    if (this.productDetails?.main_image) {
      this.productDetails.main_image = this.productDetails.main_image.replace(
        /\\/g,
        ""
      );
    }
    this.fetchOrderStatus(listing.id, "buyer");
  }

  lengthTwoofSeller: boolean = false;
  isSellerDeliveryInprogress: boolean = false;

  activeSellerStatuses: any;

  fetchOrderStatus(orderID: number, type: "seller" | "buyer"): void {
    this.getOrderStatus(orderID).subscribe(
      (res) => {
        if (type === "seller") {
          if (
            res?.status_flow?.initiated &&
            res?.status_flow?.awaiting_confirmation &&
            !res?.status_flow?.make_payment
          ) {
            this.lengthTwoofSeller = true;
          }

          if (
            res?.status_flow?.delivery_in_progress &&
            !res?.status_flow?.order_delivered
          ) {
            this.isSellerDeliveryInprogress = true;
          }

          this.sellerDetails = res;
          this.orderID = res.order_id;

          // Reset all to inactive
          this.sellerStatuses.forEach((s) => (s.active = false));

          if (res?.status_flow) {
            if (res?.status_flow?.initiated) {
              this.sellerStatuses[0].active = true;
            }
            if (res?.status_flow?.awaiting_confirmation) {
              this.sellerStatuses[1].active = true;
            }
            if (res?.status_flow?.make_payment) {
              this.sellerStatuses[2].active = true;
            }
            if (res?.status_flow?.preparing_shipment) {
              this.sellerStatuses[3].active = true;
            }
            if (res?.status_flow?.delivery_in_progress) {
              this.sellerStatuses[4].active = true;
            }
            if (res?.status_flow?.order_delivered) {
              this.sellerStatuses[5].active = true;
            }
            if (res?.status_flow?.order_completed) {
              this.sellerStatuses[6].active = true;
            }
            if (res?.status_flow?.order_canceled) {
              this.sellerStatuses[7].active = true;
            }
          }

          // 🔥 Filter only active statuses for display
          this.activeSellerStatuses = this.sellerStatuses.filter(
            (s) => s.active
          );
        } else if (type == "buyer") {
          console.log("Type is Buyes");
          this.buyerDetails = res;
          // Reset all to inactive
          this.statuses.forEach((s) => (s.active = false));

          if (res?.status_flow) {
            if (res?.status_flow?.initiated) {
              this.statuses[0].active = true;
            }
            if (res?.status_flow?.awaiting_confirmation) {
              this.statuses[1].active = true;
            }
            if (res?.status_flow?.make_payment) {
              this.statuses[2].active = true;
            }
            if (res?.status_flow?.preparing_shipment) {
              this.statuses[3].active = true;
            }
            if (res?.status_flow?.delivery_in_progress) {
              this.statuses[4].active = true;
            }
            if (res?.status_flow?.order_delivered) {
              this.statuses[5].active = true;
            }
            if (res?.status_flow?.order_completed) {
              this.statuses[6].active = true;
            }
            if (res?.status_flow?.order_canceled) {
              this.statuses[7].active = true;
            }
          }

          // 🔥 Filter only active buyer statuses
          this.activeBuyerStatuses = this.statuses.filter((s) => s.active);
        }

        this.getOrderDetails();
      },
      (error) => {
        console.error("Error fetching order status:", error);
      }
    );
  }

  activeBuyerStatuses: any[] = [];

  getOrderStatus(orderID: number): Observable<any> {
    return this.http.getOrderStatus(orderID);
  }

  deleteListing(listing) {
    this.http.removeProduct(listing.id).subscribe(
      (res) => {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("success", "Product Delete Successfully");
        } else {
          this.alertService.showAlert("success", "تم حذف المنتج بنجاح");
        }

        this.fetchListings();
      },
      (err) => {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error in Deleting Product");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء حذف المنتج");
        }
      }
    );
  }

  showSellerConfirmOrderAvailability: boolean = false;
  showSellerProofofShipping: boolean = false;

  callSellerOption() {
    if (this.lengthTwoofSeller) {
      this.showSellerConfirmOrderAvailability = true;
    }
    if (this.isSellerDeliveryInprogress) {
      this.showSellerProofofShipping = true;
    }
  }

  shippingCharges: any;
  offerValidity: any;

  sendSellerOffer() {
    let userIDD;
    if (localStorage.getItem("userID")) {
      userIDD = localStorage.getItem("userID").toString();
    }

    const formData = {
      product_id: this.orderDetails.product_id || 0,
      sender_id: userIDD || 0,
      offer_id: Number(this.orderDetails.offer_id) || 0,
      // offer_price: Number(this.orderDetails.final_price) || 0,
      ship_price: this.shippingCharges || 0,
      // Safely handle null or undefined chat_id
      chat_id: this.orderDetails.chat_id
        ? this.orderDetails.chat_id.toString()
        : "0", // Fallback to '0' if null/undefined
      validity_days: this.offerValidity || 0,
    };

    this.http.sendOffer(formData).subscribe(
      (res) => {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("success", "Offer Sent Successfully");
        } else {
          this.alertService.showAlert("success", "تم إرسال العرض بنجاح");
        }
      },
      (err) => {
        const errorMessage = err.error?.message || "Something went wrong!";
        this.alertService.showAlert("warning", errorMessage);
      }
    );
  }

  markAsSold() {
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
    //     this.alertService.showAlert("warning", "Error in Product Mark as Sold");
    //   }
    // );
  }

  cancelSellerOffer() {
    this.showSellerConfirmOrderAvailability = false;
  }

  trackingID: any;
  logisticsPartner: any;
  uploadedFiles: File[] = [];
  imagePreviews: string[] = [];
  allowedExtensions = ["jpeg", "jpg", "png"];

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

  // Remove selected image
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
        this.showSellerProofofShipping = false;
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

  cancelProofofShipMent() {
    this.showSellerProofofShipping = false;
  }

  getMesageDetails(chat) {
    const chatDetails = {
      id: chat.chat_id,
    };
    this.router.navigate(["/chat"], {
      state: {
        fromRoute: "gotToChat",
        data: chatDetails,
        productID: chat.product_id,
        chatID: chat.chat_id,
      },
    });
  }

  // for buyer
  statuses = [
    {
      label: "Order Initiated",
      description: "Order has been initiated.",
      active: false,
    },
    {
      label: "Awaiting For Confirmation",
      description: "Waiting for seller to confirm the order.",
      active: false,
    },
    {
      label: "Make Payment",
      description: "Make a payment for your order.",
      active: false,
    },
    {
      label: "Preparing Shipment",
      description: "Seller is preparing your order.",
      active: false,
    },
    {
      label: "Delivery in Progress",
      description: "Click to track your order.",
      active: false,
    },
    {
      label: "Payout Confirmation",
      description: "Your payment has been released.",
      active: false,
    },
    {
      label: "Order Delivered",
      description: "Authorize payout for your order.",
      active: false,
    },
    {
      label: "Order canceled",
      description: "Your order has been canceled.",
      active: false,
    },
  ];

  // for Seller
  sellerStatuses = [
    {
      label: "Order Initiated",
      description: "Buyer has initiated the order.",
      active: false,
    },
    {
      label: "Confirm Order Availability",
      description: "Confirm availability for your listed order.",
      active: false,
    },
    {
      label: "Awaiting Payment",
      description: "Awaiting payment confirmation from buyer.",
      active: false,
    },
    {
      label: "Prepare Shipment",
      description: "Prepare shipment for your order.",
      active: false,
    },
    {
      label: "Delivery in Progress",
      description: "Click to track your order.",
      active: false,
    },
    {
      label: "Order Delivered",
      description: "Awaiting for buyer to authorize payment.",
      active: false,
    },
    {
      label: "Order Completed",
      description: "Your order has been completed successfully.",
      active: false,
    },
    {
      label: "Order canceled",
      description: "The order was canceled by the buyer.",
      active: false,
    },
  ];

  routeToChat() {
    this.router.navigate(["/chat"], {
      state: { chatID: this.chat_ID, productID: this.forSendingProductID },
    });
  }

  // Cart Items Details

  cartItems = [
    {
      image: "assets/images/grey.png",
      name: "Python Skin - Slate Grey",
      color: "Slate Grey",
      price: 150.5,
      quantity: 1,
      selected: false,
    },
    {
      image: "assets/images/copper.png",
      name: "Python Skin - Copper Brown",
      color: "Copper Brown",
      price: 150.5,
      quantity: 1,
      selected: false,
    },
    {
      image: "assets/images/green.png",
      name: "Python Skin - Juniper Green",
      color: "Juniper Green",
      price: 150.5,
      quantity: 1,
      selected: true,
    },
  ];

  increment(item: any) {
    item.quantity++;
  }

  decrement(item: any) {
    if (item.quantity > 1) item.quantity--;
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter((i) => i !== item);
  }

  getTotalItems() {
    return this.cartItems.length;
  }

  getSubTotal() {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}
