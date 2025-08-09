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
import * as moment from 'moment';

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
  selectedProfileImage: File | null = null;
  profileImagePreview: string | null = null;

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
  country = new FormControl({value: "Saudi Arabia", disabled: true}, [
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
    // {
    //   label: "Cart Items",
    //   arabicLabel: "المفضلة",
    //   black_icon: "assets/images/black_cartitems.svg",
    //   white_icon: "assets/images/white_cartitems.svg",
    // },
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

  listings: any[] = [];
  userID: any;
paymentId: any;
  
  ngOnInit(): void {
    this.userID = localStorage.getItem("userID");
    if (!this.userID) {
      this.loginFirst();
    }

   
    // Check for payment callback in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('paymentId');
    if (paymentId) {
      localStorage.setItem('paymentId', paymentId);
      // this.handlePaymentCallback(null);
    }
    this.paymentId = localStorage.getItem('paymentId');
    if (history?.state?.activeRouteType == "Favorites") {
      this.activeIndex = 6;
      this.setActive(this.activeIndex)
    }

    if (history?.state?.activeRouteType == "myListings") {
      this.activeIndex = 3;
    }

    if (history?.state?.activeRouteType == "buyOrders") {
      this.activeIndex = 4;
      this.getBuyOrders();
    }

    if (history?.state?.activeRouteType == "sellOrders") {
      this.activeIndex = 5;
      this.getSellOrders();
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

    if (history?.state?.activeRouteType == "cart") {
      console.log(" --------------------- this.activeIndex == 7 ---------------------");
      this.activeIndex = 7;
      this.setActive(this.activeIndex)
      // this.getCartList();
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

  onProfileImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedProfileImage = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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
          country: 'Saudi Arabia',
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
      if(this.orderDetails?.product?.main_image){
        this.orderDetails.product.main_image =
          this.orderDetails.product.main_image.replace(/\\/g, "");
      }
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
      // this.getAccessoriesWishList();
      // this.getWishList();
      this.getAccessoriesWishList();
    } else if (this.activeIndex == 1) {
      // this.getCountryLists();
      this.getCityLists('Saudi Arabia');
      this.getBillingInformation();
    } else if (this.activeIndex == 2) {
      this.getLatestMessages();
    }else if (this.activeIndex == 7) {
      this.getCartList();
    }
  }

  accessoriesWishList: any[] = [];
  selectedFilter: string = "product";

  onFilterChange(event: any) {
    this.selectedFilter = event;
    if(this.selectedFilter == "product"){
      this.getWishList();
    }else{
      this.getAccessoriesWishList();
    }
  }

  getAccessoriesWishList() {
    this.http.getAccessoryWishList().subscribe((res) => {
      this.accessoriesWishList = res.data.map((item: any) => {
        item.image = item.image.replace(/\\/g, "");
        return item;
      })  ;
    });
  }

  goToAccessoryDetails(accessory) {
    this.router.navigate(["/accessories/details"], {
      // state: { accessory: accessory },
      queryParams: { id: accessory.id },
    });
  }

  
  lugWidth=[];
  Buckle=[];
  Length=[];
  Color:any;
  getCartList() {
    this.http.getCartList().subscribe((res) => {
      this.cartItems = res.items;
      if(this.cartItems){
        this.cartItems = this.cartItems?.map((item: any) => {
          item.accessory.main_image = item.accessory.main_image.replace(/\\/g, "");
          return item;
        });

        this.Buckle = res?.items[0]?.accessory?.inventories[0]?.attribute_values;
        this.Length = res?.items[0]?.accessory?.inventories;
        this.Color = res?.items[0]?.accessory?.inventories[0]?.attribute_values;
        Object.values(res?.items[0]?.accessory?.attributes || {}).forEach(attrObj => {
          if (attrObj && typeof attrObj === 'object') {
            this.lugWidth.push(...Object.keys(attrObj));
          }
        });
      }
    });
  }

  countryLists: any;
  cityLists: any;

  // getCountryLists() {
  //   this.http.getCountryLists().subscribe((res) => {
  //     this.countryLists = res.data;
  //   });
  // }

  // getCountryName(country) {
  //   this.getCityLists(country.value)
  // }

  getCityLists(country) {
    const formData = {
      country: country,
    }
    this.http.getCityLists(formData).subscribe((res) => {
      this.cityLists = res.data;
    });
  }

  chats: any;
  filteredChats: any;
  getLatestMessages() {
    this.http.getChatsWithLatestMessage().subscribe((res) => {
      this.chats = res.chats.map(
        (chat) => {
          chat.product.main_image = chat?.product?.main_image.replace(/\\/g, "/");
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

  sellOrders: any[] = [];

  getSellOrders() {
    this.http.getSellOrders().subscribe((res) => {
      this.sellOrders = res.orders.map((detail: any) => {
        if (detail?.product.main_image) {
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
  // sellerDetails: any = null;
  // buyerDetails: any = null;
  productDetails: any;
  orderID: any;
  orderDate: any;
  estimateDelivery: any;
  chat_ID: any;
  forSendingProductID: any;
  SellerCityForDisplay: any;
  sellerImageName:any;

  detailListing(listing: any): void {
    console.log("Listing Details",listing)
    this.offerHistoryDetails = []
    this.SellerNameForDisplay = listing.buyer.name;
    this.SellerCityForDisplay = listing.buyer.city;
    this.isShowSellOrdersListngDetails = true;
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

  SellerNameForDisplay: any;

  // existingProductUserID:any;
  detailsBuyListing(listing: any): void {
    this.offerHistoryDetails = []
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
  selectedProductDetails:any;
  activeSellerStatuses: any;

  backUpSelectedProductWhenBuyandSellitemClicked:any;

  fetchOrderStatus(orderID: number, type: "seller" | "buyer"): void {
    
    this.getOrderStatus(orderID).subscribe(
      (res) => {
        if (type === "seller") {

          let initiate_ = '';
          let awaiting_confirmation_ = '';
          let make_payment_ = '';
          let delivery_in_progress_ = '';
          let order_delivered_ = '';
          let preparing_shipment_ = '';
          let order_completed_ = '';
          let order_canceled_ = '';

          if(res?.data?.history){
            res?.data?.history.forEach((history:any)=>{
              if(history.new_status == 'initiated'){
               initiate_ = 'true';
               this.sellerStatuses[0].time = moment(history.created_at).fromNow();
              }
              if(history.new_status == 'awaiting_confirmation' || history.new_status == 'add_shipping'){
                awaiting_confirmation_ = 'true'
                this.sellerStatuses[1].time = moment(history.created_at).fromNow();
               }
               if(history.new_status == 'make_payment'){
                make_payment_ = 'true';
                this.sellerStatuses[2].time = moment(history.created_at).fromNow();
               }
               if(history.new_status == 'preparing_shipment'){
                preparing_shipment_ = 'true';
                this.sellerStatuses[3].time = moment(history.created_at).fromNow();
              }
              if(history.new_status == 'delivery_in_progress'){
                delivery_in_progress_ = 'true';
                this.sellerStatuses[4].time = moment(history.created_at).fromNow();
              }
              if(history.new_status == 'order_delivered'){
                order_delivered_ = 'true';
                this.sellerStatuses[5].time = moment(history.created_at).fromNow();
              }
              if(history.new_status == 'order_completed'){
                order_completed_ = 'true';
                this.sellerStatuses[6].time = moment(history.created_at).fromNow();
              }
              if(history.new_status == 'order_canceled'){
                order_canceled_ = 'true';
                this.sellerStatuses[7].time = moment(history.created_at).fromNow();
              }
              
            })
          }

          if (initiate_ && !awaiting_confirmation_ && !make_payment_) 
          {
            console.log("lengthTwoofSeller",this.lengthTwoofSeller)
            this.lengthTwoofSeller = true;
          }

          if (delivery_in_progress_ && !order_delivered_) {
            console.log("isSellerDeliveryInprogress",this.isSellerDeliveryInprogress)
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
        } else if (type == "buyer") {
          // this.buyerDetails = res;
          // Reset all to inactive
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
          // 🔥 Filter only active buyer statuses
          this.activeBuyerStatuses = this.statuses.filter((s) => s.active);
        }
        this.selectedProductDetails = res?.data?.order?.product;
        // this.backUpSelectedProductWhenBuyandSellitemClicked = res?.data;
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
         console.log("PROOF images",this.backUpSelectedProductWhenBuyandSellitemClicked?.order?.shipping_proof)
        this.selectedProductDetails.main_image = this.selectedProductDetails.main_image.replace(/\\/g, "");
        this.offerHistory(res?.data?.order?.offer_id)
        this.getOrderDetails();
      },
      (error) => {
        console.error("Error fetching order status:", error);
      }
    );
  }

  get totalPrice(): number {
    const shipPrice = Number(this.backUpSelectedProductWhenBuyandSellitemClicked?.order?.offer?.ship_price || 0);
    const finalPrice = Number(this.backUpSelectedProductWhenBuyandSellitemClicked?.order?.final_price || 0);
    return shipPrice + finalPrice;
  }
  

  formateTime(time: any) {
    const result = moment(time).fromNow(); // "in 3 days" or "3 days ago"
    return result.startsWith("in ") 
      ? result.replace("in ", "") + " left" 
      : result; 
  }

  offerHistoryDetails:any;
  hoveredStatus: any = null;
  closeTimeout: any;
  
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


  activeBuyerStatuses: any[] = [];

  getOrderStatus(orderID: number): Observable<any> {
    return this.http.OrderHistory(orderID);
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
  showBuyerandSellerProofOfOwnerShipReadOnlyModal:boolean = false;
  callSellerOption(i:any) {
    console.log("this.activeSellerStatuses.length = " ,this.activeSellerStatuses.length )
    console.log("i = " ,i )
    if (this.lengthTwoofSeller && i == 1) {
      this.showSellerConfirmOrderAvailability = true;
    }
    // if (this.isSellerDeliveryInprogress && i == 4) {
    //   this.showSellerProofofShipping = true;
    // }
    if(i == 3 && this.activeSellerStatuses.length == 4)
    {
      this.showSellerProofofShipping = true
    }

    if(i == 4 && this.activeSellerStatuses.length >= 5){
      this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = true;
    }
  }

  showBuyerMakePayment: boolean = false;

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

  closeshowBuyerandSellerProofOfOwnerShipReadOnlyModal(){
    this.showBuyerandSellerProofOfOwnerShipReadOnlyModal = false;
  }

  shippingCharges: any;
  offerValidity: any;

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
    // const formData = {
    //   product_id: this.selectedProductDetails.id || 0,
    //   sender_id: userIDD || 0,
    //   offer_id: Number(this.orderDetails?.offer_id) || 0,
    //   ship_price: this.shippingCharges || 0,
    //   // Safely handle null or undefined chat_id
    //   chat_id: this.orderDetails?.chat_id
    //     ? this.orderDetails?.chat_id.toString()
    //     : "0", // Fallback to '0' if null/undefined
    //   validity_days: this.offerValidity || 0,
    // };
    // console.log("FormData",formData)
    // sendShipmenttoBuyer(formData)
    // this.http.sendOffer(formData).subscribe(
    //   (res) => {
    //     if (this.translateService.currentLang == "en") {
    //       this.alertService.showAlert("success", "Offer Sent Successfully");
    //     } else {
    //       this.alertService.showAlert("success", "تم إرسال العرض بنجاح");
    //     }
    //   },
    //   (err) => {
    //     const errorMessage = err.error?.message || "Something went wrong!";
    //     this.alertService.showAlert("warning", errorMessage);
    //   }
    // );
  }


  buyerMakePayment() {

    console.log("Buyer Make Payment caling")
    let userIDD;
    if (localStorage.getItem("userID")) {
      userIDD = localStorage.getItem("userID").toString();
    }

    const formData = {
      chat_id: this.orderDetails?.chat_id,
      product_id: this.selectedProductDetails.id,
      receiver_id: this.backUpSelectedProductWhenBuyandSellitemClicked.order.product.created_by,
      action_type: "make_payment",
    };
    console.log("Buyer Make Payment caling",formData)
    // console.log("receiver_id",receiver_id)
    this.http.sendMessage(formData).subscribe(
      (res) => {
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

  cancelMakePayment(){
    this.showBuyerMakePayment = false
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

  cancelProofofShipMent() {
    this.showSellerProofofShipping = false;
  }

  getMesageDetails(chat) {
    const chatDetails = {
      id: chat.chat_id,
    };

    const productDetails = {
      id: chat.product_id,
    };

    this.router.navigate(["/chat"], {
      state: {
        fromRoute: "gotToChat",
        data: productDetails,
        chatDetails:chat,
        productID: chat.product_id,
        chatID: chat.chat_id,
      },
    });
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

  // for Seller
  sellerStatuses = [
    {
      label: "Order Initiated",
     time:null,
      description: "Buyer has initiated the order.",
      active: false,
    },
    {
      label: "Confirm Order Availability",
     time:null,
      description: "Confirm availability for your listed order.",
      active: false,
    },
    {
      label: "Awaiting Payment",
     time:null,
      description: "Awaiting payment confirmation from buyer.",
      active: false,
    },
    {
      label: "Prepare Shipment",
     time:null,
      description: "Prepare shipment for your order.",
      active: false,
    },
    {
      label: "Delivery in Progress",
     time:null,
      description: "Click to track your order.",
      active: false,
    },
    {
      label: "Order Delivered",
     time:null,
      description: "Awaiting for buyer to authorize payment.",
      active: false,
    },
    {
      label: "Order Completed",
     time:null,
      description: "Your order has been completed successfully.",
      active: false,
    },
    {
      label: "Order canceled",
     time:null,
      description: "The order was canceled by the buyer.",
      active: false,
    },
  ];

  routeToChat() {
    console.log('this slectedProduct details',this.backUpSelectedProductWhenBuyandSellitemClicked)
    console.log("this.forSendingProductID",this.forSendingProductID)
    this.router.navigate(["/chat"], {
      state: { chatID: this.chat_ID, productID: this.forSendingProductID,chatRouteFrom:'orderDetails', productDetailsFromOrder: this.backUpSelectedProductWhenBuyandSellitemClicked},
    });
  }

  // Cart Items Details

  cartItems:any;

  increment(item: any) {
    item.quantity++;
    this.updateCart(item);
  }

  updateCart(item: any) {
    const formData = {
      accessory_id: item.accessory.id,
      quantity: item.quantity
    }
    this.http.updateCart(formData).subscribe((res) => {
    });
  }

  decrement(item: any) {
    if (item.quantity > 1) item.quantity--;
    this.updateCart(item);
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter((i) => i !== item);
    this.http.deleteCart(item.accessory.id).subscribe((res) => {
      this.alertService.showAlert("success", "Item removed from cart");
      this.getCartList();
    });
  }

  getTotalItems() {
    return this.cartItems?.length;
  }

  getSubTotal() {
    // return this.cartItems.reduce(
    //   (total, item) => total + item.price * item.quantity,
    //   0
    // );

    return this.cartItems.reduce(
      (total, item) => total + item.unit_price * item.quantity,
      0
    );
  
  }

  goToCheckout() {
    this.router.navigate(['/myListing/summary'])
  }

}
