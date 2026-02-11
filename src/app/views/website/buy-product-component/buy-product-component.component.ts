import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { ModelLoginComponent } from "../../auth/model-login/model-login.component";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/services/lang-service/language.service";
import { CustomOfferComponent } from "../../modal/custom-offer/custom-offer.component";
import { ConfirmationModelComponent } from "../../modal/confirmation-model/confirmation-model.component";
import { OrderInitiatedModelComponent } from "../../modal/order-initiated-model/order-initiated-model.component";
import { environment } from "src/environments/environment";
import mediumZoom from 'medium-zoom';
import { NgxImageZoomModule } from 'ngx-image-zoom';

@Component({
  selector: "app-buy-product-component",
  templateUrl: "./buy-product-component.component.html",
  styleUrls: ["./buy-product-component.component.css"],
})
export class BuyProductComponentComponent implements OnInit {
   apiUrl = environment.apipath+ '/';
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  cosmeticCondition: number;
  satisfaction: number;
  experience: number = 4;
  productMainImage: any;
  currentLanguage: string;
  @ViewChild("targetContainer") targetContainer!: ElementRef;

  myThumbnail:any;
  myFullresImage:any;
  isLoading: boolean = true;

  ngAfterViewInit() {

    mediumZoom('[data-zoomable]', {
      background: '#000',
      scrollOffset: 0,
    });
  }

  scrollToTarget(): void {
    this.targetContainer.nativeElement.scrollIntoView({ behavior: "smooth" });
  }
  apipath = environment.apipath;
  wishList: any;
  getWishList() {
    this.http.getWishList().subscribe((res) => {
      this.wishList = res.data;
    });
  }

  addWishList(id) {
    const formData = {
      product_id: id,
    };
    this.http.addWishList(formData).subscribe((res) => {
      this.wishList = res.data;
      this.getWishList();
      // this.initializeComponent();
    });
  }

  getDealerSince(createdAt: string): string {
    if (!createdAt) return "";
    const year = new Date(createdAt).getFullYear();

    if (this.translateService.currentLang == "en") {
      return `Since ${year}`;
    } else {
      return `${year} منذ`;
    }
  }

  displayedWatches: number = 6;
  currentPage: number = 1;
  totalPages: number = 1;

  async loadMoreWatches() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      try {
        const res = await this.http
          .getSimilarProductsByIDwithPage(this.ProductID, this.currentPage)
          .toPromise();
        const newWatches = res.data.data.map((product: any) => ({
          ...product,
          // main_image: product.main_image.replace(/\\/g, ""),
          main_image: product.main_image
            ? product.main_image.replace(/\\/g, "")
            : null,
        }));
        this.similarWatchesList = [...this.similarWatchesList, ...newWatches];
        this.totalPages = res.data.last_page;
      } catch (err) {
        console.error("Error loading more watches:", err);
      }
    }
  }

  reviewsListIndex: number = 2;

  loadMoreReviews() {
    this.reviewsListIndex += 2;
  }

  productsList: any;
  selectedImage: string;
  thumbnails: { url: string; type: string }[] = [];

  constructor(
    private http: HttpService,
    private alertService: AlertsServicesService,
    private router: Router,
    private dialog: MatDialog,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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

  selectedType: string = "image";

  swapImages(clickedItem: { url: string; type: string }): void {
    if (clickedItem.type === "image") {
      const imageUrl = this.apiUrl + clickedItem.url;
      
      // Update image URLs immediately for instant display
      // Since thumbnails are already loaded, the main image should load quickly from cache
      this.myThumbnail = imageUrl;
      this.myFullresImage = imageUrl;
      
      // Immediately update the selected image
      this.selectedImage = clickedItem.url;
      this.selectedType = "image";
      
      // Force change detection to update the view immediately
      this.cdr.detectChanges();
      
      // Preload the image in background to ensure smooth transition (if not already cached)
      const img = new Image();
      img.src = imageUrl;
    }
    if (clickedItem.type === "video") {
      this.selectedImage = clickedItem.url;
      this.selectedType = "video";
      this.cdr.detectChanges();
    }
  }

  // Preload all thumbnail images for faster swapping
  preloadThumbnailImages(): void {
    if (this.thumbnails && this.thumbnails.length > 0) {
      this.thumbnails.forEach((item) => {
        if (item.type === 'image') {
          const img = new Image();
          img.src = this.apiUrl + item.url;
        }
      });
    }
  }

  productDetails: any;
  dealerDetails: any;
  dealerUserDetails: any;
  ProductID: any;
  routeFrom: any;
  isUserLogin: any;

  loginFirst() {
    const dialogRef = this.dialog.open(ModelLoginComponent, {
      backdropClass: "hello",

      width: "600px",

      data: { message: "header" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  fromChat: any;
  orderID: any;
  chatID: any;
  loggedUserType: any;

  getOrderandChatID() {
    this.http.getOrderandChatIDDetails(this.productDetails.id).subscribe((res) => {
      if(res?.order?.id){
        this.orderID = res?.order?.id;
      }
      if(res?.chats?.chat_id){
        this.chatID = res?.chats?.chat_id;
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.isUserLogin = localStorage.getItem("isLoggedIn");
    if (this.isUserLogin === "true") {
      this.getWishList();
    }
    this.routeFrom = history.state.param;

    if (this.routeFrom === "listing-to-product") {
      this.ProductID = history.state.ID;

      this.productDetails = history.state.data;
      this.getDetailsofUnVerfiedProduct();
    } else {
      const watchId = this.route.snapshot.queryParamMap.get("id");
      if (watchId) {
        this.ProductID = watchId;
      } else {
        this.ProductID = history.state.data.id;
      }

      const fromChat = this.route.snapshot.queryParamMap.get("fromChat");
      if (fromChat === "true") {
        this.fromChat = true;
        //  this.openDialog();
      }
    }
    // if(this.routeFrom !== "listing-to-product"){
    // if(this.fromChat == true ){
    //   this.initializeStatusReservedComponent();
    // }else{
    this.initializeComponent();
    // }
    // }
  }

  async getDetailsofUnVerfiedProduct() {
    try {
      const res = await this.http
        .getProductsofUnverifiedByID(this.ProductID)
        .toPromise();
      this.isDealer = res.typeOfProduct;
      this.productDetails = res.data;
      this.isReviewsCount = res.reviewsCount;
      if (this.productDetails.additional_images) {
        this.productDetails.additional_images = JSON.parse(
          this.productDetails.additional_images
        );
      }

      if (this.productDetails.main_image) {
        this.productDetails.main_image = this.productDetails.main_image.replace(
          /\\/g,
          ""
        );
      }

      if (this.productDetails.created_by.id == localStorage.getItem("userID")) {
        this.loggedUserType = "seller";
      } else {
        this.loggedUserType = "buyer";
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  }

  isReviewsCount: any;

  async initializeComponent() {
    this.isLoading = true;
    try {
      if (this.routeFrom != "listing-to-product" && this.fromChat != true) {
        await this.fetchProductDetails();
      } else {
        await this.getDetailsofUnVerfiedProduct();
      }
      this.productMainImage = this.productDetails.main_image;
      this.thumbnails = this.productDetails.additional_images.map((image) => ({
        url: image.replace(/\\/g, ""),
        type: "image",
      }));

      if (this.productDetails?.proof_image_1) {
        this.productDetails.proof_image_1 =
          this.productDetails.proof_image_1.replace(/\\/g, "");
        this.thumbnails.push({
          url: this.productDetails.proof_image_1,
          type: "image",
        });
      }

      if (this.productDetails?.proof_image_2) {
        this.productDetails.proof_image_2 =
          this.productDetails.proof_image_2.replace(/\\/g, "");
        this.thumbnails.push({
          url: this.productDetails.proof_image_2,
          type: "image",
        });
      }

      if (this.productDetails?.video) {
        this.productDetails.video = this.productDetails.video.replace(
          /\\/g,
          ""
        );
        this.thumbnails.push({ url: this.productDetails.video, type: "video" });
      }

      if (this.productMainImage) {
        this.productMainImage = this.productMainImage.replace(/\\/g, "");
        this.thumbnails.unshift({
          url: this.productMainImage,
          type: "image",
        });
      }

      if (this.thumbnails.length > 0) {
        this.selectedImage = this.thumbnails[0].url; // Store only the URL
        this.myThumbnail = this.apiUrl + this.selectedImage;
        this.myFullresImage = this.apiUrl + this.selectedImage;
        // Preload all thumbnail images for faster swapping
        this.preloadThumbnailImages();
      }


      if (
        this.isDealer === "dealer" &&
        this.routeFrom !== "listing-to-product"
      ) {
        if (this.productDetails.created_by.id && this.isReviewsCount) {
          await this.fetchDealerDetails(this.productDetails.created_by.id);
          await this.fetchDealerUserDetails(this.productDetails.created_by.id);
        }
      }
      if (this.isUserLogin === "true") {
        this.getOrderandChatID();
      }


      await this.getAllSimilarProducts();
    } catch (err) {
      console.error("Error initializing component:", err);
    } finally {
      this.isLoading = false;
    }
  }

  viewProduct(watchID) {
    this.ProductID = watchID;
    window.scrollTo(0, 0);
    this.initializeComponent();
  }

  async fetchProductDetails() {
    try {
      const res = await this.http.getProductsByID(this.ProductID).toPromise();
      this.isDealer = res.typeOfProduct;
      this.productDetails = res.data;
      this.isReviewsCount = res.reviewsCount;
      if (this.productDetails.additional_images) {
        this.productDetails.additional_images = JSON.parse(
          this.productDetails.additional_images
        );
      }

      if (this.productDetails.main_image) {
        this.productDetails.main_image = this.productDetails.main_image.replace(
          /\\/g,
          ""
        );
      }

      if (this.productDetails.created_by.id == localStorage.getItem("userID")) {
        this.loggedUserType = "seller";
      } else {
        this.loggedUserType = "buyer";
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  }

  async fetchDealerDetails(dealerId: number) {
    try {
      const res = await this.http.getDealerReviewsByID(dealerId).toPromise();
      this.dealerDetails = res.data.map((detail: any) => {
        if (detail.main_image) {
          detail.main_image = detail.main_image.replace(/\\/g, "");
        }
        return detail;
      });
    } catch (err) {
      console.error("Error fetching dealer details:", err);
    }
  }

  async fetchDealerUserDetails(userId: number) {
    try {
      const res = await this.http.getRevieweruserByID(userId).toPromise();
      this.dealerUserDetails = res.data;
      this.dealerReviewsRatings = res.data.ratings;
      this.dealerReviewstotalRatings = Object.values(
        this.dealerReviewsRatings
      ).reduce((a: number, b: number) => a + b, 0);
      this.cosmeticCondition = res.data.cosmetic_condition;
      this.satisfaction = res.data.satisfaction;
    } catch (err) {
      console.error("Error fetching dealer user details:", err);
    }
  }

  getPercentage(count: number): number {
    return this.dealerReviewstotalRatings > 0
      ? (count / this.dealerReviewstotalRatings) * 100
      : 0;
  }

  similarWatchesList: any;

  async getAllSimilarProducts() {
    try {
      const res = await this.http
        .getSimilarProductsByID(this.ProductID)
        .toPromise();
      this.similarWatchesList = res.data.data.map((product: any) => {
        return {
          ...product,
          main_image: product.main_image
            ? product.main_image.replace(/\\/g, "")
            : null,
        };
      });

      this.totalPages = res.data.last_page;
    } catch (err) {
      console.error("Error fetching similar products:", err);
    }
  }

  isDealer: any = "";
  dealerReviewsRatings: any;
  dealerReviewstotalRatings: any;

  getConditionPercentage(): number {
    return (this.cosmeticCondition / 5) * 100;
  }

  getSatisfactionPercentage(): number {
    return (this.satisfaction / 5) * 100;
  }

  getInitials(): string {
    if (this.dealerUserDetails?.user_details?.name) {
      return this.dealerUserDetails.user_details.name
        .substring(0, 2)
        .toUpperCase();
    }
    return "";
  }

  copyCurrentUrl() {
    const currentUrl = window.location.href; // Get the current browser URL

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        // Optionally, you can show a success message or notification
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("success", "Url copy Successfully");
        }else{
             this.alertService.showAlert("success", "تم نسخ الرابط بنجاح");
        }
      })
      .catch((err) => {
        console.error("Could not copy the URL: ", err);
      });
  }

  goToOrderDetails() {
    let OrderTypeval;
    if (this.productDetails.created_by.id == localStorage.getItem("userID")) {
      OrderTypeval = "sell";
    } else {
      OrderTypeval = "buy";
    }

    if(OrderTypeval == 'buy'){
      this.router.navigate(["/myprofile/buy/order/details"],{ queryParams: { id: this.productDetails.id } })
    }else{
      this.router.navigate(["/myprofile/sell/order"])
    }

    // this.router.navigate(["/myListing"], {
    //   state: {
    //     data: {
    //       id: this.orderID,
    //       product_id: this.productDetails.id,
    //       product: this.productDetails,
    //       chat_id: this.chatID,
    //     },

    //     orderID: this.orderID,
    //     Ordertype: OrderTypeval,
    //     fromRoute: "gotToOrderDetails",
    //   },
    // });
  }

  goToChatOrOrderDetails() {
    console.log("Calling goToChatOrOrderDetails, line 507", this.productDetails)
    console.log("this.chatID", this.chatID)
    let OrderTypeval;
    if (
      this.productDetails.created_by.id ==
      localStorage.getItem("userID")
    ) {
      OrderTypeval = "sell";
    } else {
      OrderTypeval = "buy";
    }

    const dialogRef = this.dialog.open(
      OrderInitiatedModelComponent,
      {
        width: "700px",
        data: {
          label: "Do you want to see your order details or chat with seller ?",
          paragraph:
            "Please select one of the options below to proceed.",
        },
      }
    );

    dialogRef.afterClosed().subscribe(
      (result) => {
       console.log("result", result)
      if (result == "openChat" || result == "viewOrder") {
        if (result == "openChat") {
          console.log("Calling goToChatOrOrderDetails, line 534", this.productDetails)
          console.log("this.chatID", this.chatID)
          this.router.navigate(["/chat"], {
            state: {
              data: this.productDetails,
              chatID: this.chatID,
              fromRoute: "gotToChat",
            },
          });
        } else if (result == "viewOrder") {
          if(OrderTypeval == 'buy'){
            this.router.navigate(["/myprofile/buy/order/details"],{ queryParams: { id: this.productDetails.id } })
          }else{
            this.router.navigate(["/myprofile/sell/order"])
          }
          // this.router.navigate(["/myListing"], {
          //   state: {
          //     data: {
          //       id: this.orderID,
          //       product_id: this.productDetails.id,
          //       product: this.productDetails,
          //       chat_id: this.chatID,
          //     },

          //     orderID: this.orderID,
          //     Ordertype: OrderTypeval,
          //     fromRoute: "gotToOrderDetails",
          //   },
          // });
        }
      }
    });
  }

  buyNow() {
    const userLogin = localStorage.getItem("user_token");
    const bodyData = {
      product_id: this.productDetails.id,
      receiver_id: this.productDetails.created_by.id,
      message: "I want to buy this product.",
    };
    if (userLogin) {
      const dialogRef = this.dialog.open(ConfirmationModelComponent, {
        width: "600px",
        data: { message: "Are you sure you want to buy this product ?" },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result == true) {
          this.http
            .buyNowFromDetailsProduct(this.productDetails.id, bodyData)
            .subscribe(
              (res) => {
                if (this.translateService.currentLang == "en") {
                  this.alertService.showAlert(
                    "success",
                    "Message send to Seller."
                  );
                }else{
                  this.alertService.showAlert(
                    "success",
                    "تم إرسال الرسالة إلى البائع."
                  );
                }


                let OrderTypeval;
                if (
                  this.productDetails.created_by.id ==
                  localStorage.getItem("userID")
                ) {
                  OrderTypeval = "sell";
                } else {
                  OrderTypeval = "buy";
                }

                const dialogRef = this.dialog.open(
                  OrderInitiatedModelComponent,
                  {
                    width: "600px",
                    data: {
                      label: "Order Initiated",
                      paragraph:
                        "You’ve initiated an order, you can track it in your buy orders.",
                    },
                  }
                );

                dialogRef.afterClosed().subscribe((result) => {
                  if (result == "openChat" || result == "viewOrder") {
                    if (result == "openChat") {
                      console.log("Calling goToChatOrOrderDetails, line 627", this.productDetails)
                      console.log("this.chatID", this.chatID)
                      this.router.navigate(["/chat"], {
                        // state: { data: this.productDetails },
                        state: {
                          data: this.productDetails,
                          chatID: this.chatID,
                          fromRoute: "gotToChat",
                        },
                      });
                    } else if (result == "viewOrder") {
                      if(OrderTypeval == 'buy'){
                        this.router.navigate(["/myprofile/buy/order/details"],{ queryParams: { id: this.productDetails.id } })
                      }else{
                        this.router.navigate(["/myprofile/sell/order"])
                      }
                      // this.router.navigate(["/myListing"], {
                      //   state: {
                      //     data: {
                      //       id: this.orderID,
                      //       product_id: this.productDetails.id,
                      //       product: this.productDetails,
                      //       chat_id: this.chatID,
                      //     },

                      //     orderID: this.orderID,
                      //     Ordertype: OrderTypeval,
                      //     fromRoute: "gotToOrderDetails",
                      //   },
                      // });
                    }
                  }else{
                    console.log("Calling initializeComponent,")
                    this.initializeComponent();
                  }
                });
              },
              (err) => {
                this.alertService.showAlert("warning", `${err.error.message}`);
              }
            );
        }
      });
    } else {
      this.loginFirst();
    }
  }

  backTo() {
    this.router.navigate(["/new-product"], {
      state: { ID: this.ProductID },
    });
  }

  gotToChat() {
    const userLogin = localStorage.getItem("user_token");
    const userID = localStorage.getItem("userID");
    if (userLogin && userID) {
      if (userID != this.productDetails.created_by.id) {
        if (this.chatID) {
          this.router.navigate(["/chat"], {
            state: {
              data: this.productDetails,
              productID: this.productDetails.id,
              chatID: this.chatID,
              fromRoute: "gotToChat",
            },
          });
        } else {
          console.log("Calling gotToChat, line 692", this.productDetails)
          const productDetails = {
            chats:{
              product:this.productDetails
            }
          }
          this.router.navigate(["/chat"], {
            state:{firstMessage: true, product_ID: this.productDetails.id, created_by: this.productDetails.created_by.id ,product_Details:productDetails},
          });
          // this.router.navigate(["/chat"], {
          //   state: { data: this.productDetails ,fromRoute: "gotToChat" ,productID: this.productDetails.id, },
          // });
        }
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "You can't chat with yourself");
        }else{
              this.alertService.showAlert("warning", `تم إرسال الرسالة إلى البائع.`);
        }
      }
    } else {
      this.loginFirst();
    }
  }

  makeanOffer() {
    const userLogin = localStorage.getItem("user_token");
    if (!userLogin) {
      this.loginFirst();
    } else {
      this.openDialogForCustomOffer();
    }
  }

  openDialogForCustomOffer() {
    const dialogRef = this.dialog.open(CustomOfferComponent, {
      width: "600px",
      data: {
        productDetail: this.productDetails,
        param: "buyComp",
        buyLabel: "Custom Offer",
        header: "Make an Offer",
        headerPara: "Send custom offer to seller.",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Calling initializeComponent,")
        this.initializeComponent();
      }
    });
  }
}
